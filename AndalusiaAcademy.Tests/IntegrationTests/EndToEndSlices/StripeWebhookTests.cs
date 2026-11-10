using System.Net;
using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using AndalusiaAcademy.API.DTOs.Admissions;
using AndalusiaAcademy.API.DTOs.Learning;
using AndalusiaAcademy.API.DTOs.Payments;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.Tests.Infrastructure;

namespace AndalusiaAcademy.Tests.IntegrationTests.EndToEndSlices;

/// <summary>
/// Stripe Checkout settlement through <c>POST /api/payments/webhook</c>: signature boundary,
/// idempotent delivery, amount validation and failure bookkeeping in the webhook inbox.
/// </summary>
[Collection(ApiCollection.Name)]
public class StripeWebhookTests
{
    private const string WebhookPath = "/api/payments/webhook";
    private const decimal Price = 150m;

    private readonly SqlServerApiFactory _factory;
    private readonly TestScenario _scenario;

    public StripeWebhookTests(SqlServerApiFactory factory)
    {
        _factory = factory;
        _scenario = new TestScenario(factory);
    }

    [Fact]
    public async Task Paid_checkout_session_settles_the_order_and_enrolls_the_learner()
    {
        var (learner, order) = await CreatePendingOrderAsync();

        var response = await SendAsync(CheckoutEvent(order.Id));

        await response.EnsureStatusAsync(HttpStatusCode.OK);
        var paid = Assert.Single((await learner.Client.GetFromJsonAsync<List<OrderDto>>("/api/payments/mine"))!);
        Assert.Equal(OrderStatuses.Paid, paid.Status);
        var attempt = Assert.Single(paid.Attempts);
        Assert.Equal("Stripe", attempt.Provider);
        Assert.Equal(PaymentAttemptStatuses.Succeeded, attempt.Status);
        Assert.Equal(Price, attempt.Amount);

        var application = Assert.Single((await learner.Client.GetFromJsonAsync<List<ApplicationDto>>("/api/applications/mine"))!);
        Assert.Equal(ApplicationStatuses.Accepted, application.Status);
        Assert.NotNull(application.EnrollmentId);
        Assert.Single((await learner.Client.GetFromJsonAsync<List<EnrollmentDto>>("/api/enrollments/mine"))!);
    }

    [Fact]
    public async Task Order_id_in_session_metadata_is_accepted()
    {
        var (learner, order) = await CreatePendingOrderAsync();

        var response = await SendAsync(CheckoutEvent(order.Id, orderIdInMetadata: true));

        await response.EnsureStatusAsync(HttpStatusCode.OK);
        Assert.Equal(OrderStatuses.Paid, await OrderStatusAsync(learner));
    }

    [Fact]
    public async Task Redelivered_and_duplicate_events_do_not_charge_or_enroll_twice()
    {
        var (learner, order) = await CreatePendingOrderAsync();
        var paymentIntent = "pi_" + Guid.NewGuid().ToString("N");
        var first = CheckoutEvent(order.Id, paymentIntent: paymentIntent);

        await (await SendAsync(first)).EnsureStatusAsync(HttpStatusCode.OK);
        await (await SendAsync(first)).EnsureStatusAsync(HttpStatusCode.OK);
        // Same payment reported by a second event (e.g. async_payment_succeeded after completed).
        await (await SendAsync(CheckoutEvent(order.Id, paymentIntent: paymentIntent,
            type: "checkout.session.async_payment_succeeded"))).EnsureStatusAsync(HttpStatusCode.OK);

        var paid = Assert.Single((await learner.Client.GetFromJsonAsync<List<OrderDto>>("/api/payments/mine"))!);
        Assert.Single(paid.Attempts);
        Assert.Single((await learner.Client.GetFromJsonAsync<List<EnrollmentDto>>("/api/enrollments/mine"))!);
    }

    [Fact]
    public async Task Unpaid_session_is_acknowledged_and_settled_by_the_later_async_success()
    {
        var (learner, order) = await CreatePendingOrderAsync();
        var paymentIntent = "pi_" + Guid.NewGuid().ToString("N");

        await (await SendAsync(CheckoutEvent(order.Id, paymentIntent: paymentIntent, paymentStatus: "unpaid")))
            .EnsureStatusAsync(HttpStatusCode.OK);
        Assert.Equal(OrderStatuses.PendingPayment, await OrderStatusAsync(learner));

        await (await SendAsync(CheckoutEvent(order.Id, paymentIntent: paymentIntent,
            type: "checkout.session.async_payment_succeeded"))).EnsureStatusAsync(HttpStatusCode.OK);
        Assert.Equal(OrderStatuses.Paid, await OrderStatusAsync(learner));
    }

    [Fact]
    public async Task Unrelated_event_types_are_acknowledged_without_side_effects()
    {
        var (learner, _) = await CreatePendingOrderAsync();
        var payload = JsonSerializer.Serialize(new
        {
            id = NewEventId(),
            type = "payment_intent.created",
            data = new { @object = new { id = "pi_x" } }
        });

        await (await SendAsync(payload)).EnsureStatusAsync(HttpStatusCode.OK);

        Assert.Equal(OrderStatuses.PendingPayment, await OrderStatusAsync(learner));
    }

    [Theory]
    [InlineData("wrong-secret")]
    [InlineData("stale-timestamp")]
    [InlineData("missing-header")]
    [InlineData("tampered-payload")]
    public async Task Events_without_a_valid_signature_are_rejected(string scenario)
    {
        var (learner, order) = await CreatePendingOrderAsync();
        var payload = CheckoutEvent(order.Id);
        var now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();

        var request = new HttpRequestMessage(HttpMethod.Post, WebhookPath);
        switch (scenario)
        {
            case "wrong-secret":
                request.Headers.Add("Stripe-Signature", Sign(payload, now, "whsec_not_the_configured_secret"));
                break;
            case "stale-timestamp":
                request.Headers.Add("Stripe-Signature", Sign(payload, now - 3600, _factory.StripeWebhookSecret));
                break;
            case "tampered-payload":
                request.Headers.Add("Stripe-Signature", Sign(payload, now, _factory.StripeWebhookSecret));
                payload = payload.Replace("\"paid\"", "\"paid\" ");
                break;
        }

        request.Content = new StringContent(payload, Encoding.UTF8, "application/json");
        var response = await _scenario.Anonymous().SendAsync(request);

        await response.EnsureStatusAsync(HttpStatusCode.BadRequest);
        Assert.Equal(OrderStatuses.PendingPayment, await OrderStatusAsync(learner));
    }

    [Fact]
    public async Task Amount_mismatch_is_rejected_and_recorded_as_a_failed_inbox_entry()
    {
        var (learner, order) = await CreatePendingOrderAsync();
        var eventId = NewEventId();

        var response = await SendAsync(CheckoutEvent(order.Id, eventId: eventId, amountMinor: 100));

        await response.EnsureStatusAsync(HttpStatusCode.Conflict);
        Assert.Equal(OrderStatuses.PendingPayment, await OrderStatusAsync(learner));
        var (status, attempts, error) = await InboxAsync(eventId);
        Assert.Equal("Failed", status);
        Assert.Equal(1, attempts);
        Assert.Contains("amount", error, StringComparison.OrdinalIgnoreCase);

        // Stripe redelivers failed events: the attempt is counted and the order is still untouched.
        await (await SendAsync(CheckoutEvent(order.Id, eventId: eventId, amountMinor: 100))).EnsureStatusAsync(HttpStatusCode.Conflict);
        Assert.Equal(2, (await InboxAsync(eventId)).Attempts);
    }

    [Fact]
    public async Task Currency_mismatch_is_rejected()
    {
        var (learner, order) = await CreatePendingOrderAsync();

        var response = await SendAsync(CheckoutEvent(order.Id, currency: "usd"));

        await response.EnsureStatusAsync(HttpStatusCode.Conflict);
        Assert.Equal(OrderStatuses.PendingPayment, await OrderStatusAsync(learner));
    }

    [Fact]
    public async Task Session_without_a_known_order_is_recorded_as_failed()
    {
        var unknownOrder = NewEventId();
        var missingReference = NewEventId();

        await (await SendAsync(CheckoutEvent(Guid.NewGuid(), eventId: unknownOrder))).EnsureStatusAsync(HttpStatusCode.NotFound);
        await (await SendAsync(CheckoutEvent(null, eventId: missingReference))).EnsureStatusAsync(HttpStatusCode.UnprocessableEntity);

        Assert.Equal("Failed", (await InboxAsync(unknownOrder)).Status);
        Assert.Equal("Failed", (await InboxAsync(missingReference)).Status);
    }

    [Fact]
    public async Task Failed_event_succeeds_when_redelivered_after_the_cause_is_fixed()
    {
        var (learner, order) = await CreatePendingOrderAsync();
        var payload = CheckoutEvent(order.Id);
        await SetOrderAmountAsync(order.Id, 999m);
        await (await SendAsync(payload)).EnsureStatusAsync(HttpStatusCode.Conflict);

        await SetOrderAmountAsync(order.Id, Price);
        await (await SendAsync(payload)).EnsureStatusAsync(HttpStatusCode.OK);

        Assert.Equal(OrderStatuses.Paid, await OrderStatusAsync(learner));
    }

    [Fact]
    public async Task Payment_after_the_seat_hold_lapsed_is_honoured_while_a_seat_is_free()
    {
        var (learner, order) = await CreatePendingOrderAsync(capacity: 2);
        await ExpireSeatHoldAsync(order.ApplicationId);

        await (await SendAsync(CheckoutEvent(order.Id))).EnsureStatusAsync(HttpStatusCode.OK);

        Assert.Equal(OrderStatuses.Paid, await OrderStatusAsync(learner));
        Assert.Single((await learner.Client.GetFromJsonAsync<List<EnrollmentDto>>("/api/enrollments/mine"))!);
    }

    [Fact]
    public async Task Payment_after_the_seat_hold_lapsed_is_not_fulfilled_when_the_offering_filled_up()
    {
        var admin = await _scenario.CreateUserAsync(AppRoles.Admin);
        var cohort = await _scenario.CreateCohortAsync(admin, capacity: 1, price: Price);
        var late = await _scenario.RegisterLearnerAsync();
        var lateOrder = await CheckoutAsync(late, cohort.OfferingId);
        await ExpireSeatHoldAsync(lateOrder.ApplicationId);
        // Another learner takes the only seat once the hold lapsed.
        await _scenario.EnrollAsync(await _scenario.RegisterLearnerAsync(), cohort.OfferingId);
        var eventId = NewEventId();

        var response = await SendAsync(CheckoutEvent(lateOrder.Id, eventId: eventId));

        await response.EnsureStatusAsync(HttpStatusCode.Conflict);
        Assert.Empty((await late.Client.GetFromJsonAsync<List<EnrollmentDto>>("/api/enrollments/mine"))!);
        Assert.Equal("Failed", (await InboxAsync(eventId)).Status);
    }

    [Fact]
    public async Task Concurrent_deliveries_of_the_same_payment_settle_exactly_once()
    {
        var (learner, order) = await CreatePendingOrderAsync();
        var paymentIntent = "pi_" + Guid.NewGuid().ToString("N");

        var responses = await Task.WhenAll(Enumerable.Range(0, 6)
            .Select(_ => SendAsync(CheckoutEvent(order.Id, paymentIntent: paymentIntent))));

        // Losers may be told to retry (409), but nothing may fail unexpectedly or settle twice.
        Assert.All(responses, r => Assert.Contains(r.StatusCode, new[] { HttpStatusCode.OK, HttpStatusCode.Conflict }));
        Assert.Contains(responses, r => r.StatusCode == HttpStatusCode.OK);
        var paid = Assert.Single((await learner.Client.GetFromJsonAsync<List<OrderDto>>("/api/payments/mine"))!);
        Assert.Equal(OrderStatuses.Paid, paid.Status);
        Assert.Single(paid.Attempts);
        Assert.Single((await learner.Client.GetFromJsonAsync<List<EnrollmentDto>>("/api/enrollments/mine"))!);
    }

    private async Task<(TestUser Learner, OrderDto Order)> CreatePendingOrderAsync(int capacity = 5)
    {
        var admin = await _scenario.CreateUserAsync(AppRoles.Admin);
        var cohort = await _scenario.CreateCohortAsync(admin, capacity: capacity, price: Price);
        var learner = await _scenario.RegisterLearnerAsync();
        return (learner, await CheckoutAsync(learner, cohort.OfferingId));
    }

    private static async Task<OrderDto> CheckoutAsync(TestUser learner, Guid offeringId)
    {
        var applyResponse = await learner.Client.PostAsJsonAsync("/api/applications", new CreateApplicationRequest(offeringId));
        await applyResponse.EnsureStatusAsync(HttpStatusCode.Created);
        var application = (await applyResponse.Content.ReadFromJsonAsync<ApplicationDto>())!;

        var orderResponse = await learner.Client.PostAsJsonAsync("/api/payments/orders", new CreateOrderRequest(application.Id));
        await orderResponse.EnsureStatusAsync(HttpStatusCode.OK);
        return (await orderResponse.Content.ReadFromJsonAsync<OrderDto>())!;
    }

    private static async Task<string> OrderStatusAsync(TestUser learner) =>
        Assert.Single((await learner.Client.GetFromJsonAsync<List<OrderDto>>("/api/payments/mine"))!).Status;

    private Task<(string Status, int Attempts, string Error)> InboxAsync(string eventId) =>
        _factory.WithDbAsync(async db =>
        {
            var inbox = await db.WebhookInboxes.AsNoTracking()
                .SingleAsync(w => w.Provider == "Stripe" && w.ProviderEventId == eventId);
            return (inbox.Status, inbox.AttemptCount, inbox.LastError ?? string.Empty);
        });

    private Task SetOrderAmountAsync(Guid orderId, decimal amount) =>
        _factory.WithDbAsync(db => db.SalesOrders.Where(o => o.Id == orderId)
            .ExecuteUpdateAsync(s => s.SetProperty(o => o.AmountDue, amount)));

    private Task ExpireSeatHoldAsync(Guid applicationId) =>
        _factory.WithDbAsync(db => db.SeatReservations.Where(r => r.ApplicationId == applicationId)
            .ExecuteUpdateAsync(s => s.SetProperty(r => r.ExpiresAt, DateTimeOffset.UtcNow.AddMinutes(-5))));

    private Task<HttpResponseMessage> SendAsync(string payload)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, WebhookPath)
        {
            Content = new StringContent(payload, Encoding.UTF8, "application/json")
        };
        request.Headers.Add("Stripe-Signature",
            Sign(payload, DateTimeOffset.UtcNow.ToUnixTimeSeconds(), _factory.StripeWebhookSecret));
        return _scenario.Anonymous().SendAsync(request);
    }

    private static string NewEventId() => "evt_" + Guid.NewGuid().ToString("N");

    /// <summary>Mirrors the shape of a Stripe Checkout Session event (test orders are priced in EGP).</summary>
    private static string CheckoutEvent(
        Guid? orderId,
        string? eventId = null,
        string? paymentIntent = null,
        string type = "checkout.session.completed",
        string paymentStatus = "paid",
        long amountMinor = 15000,
        string currency = "egp",
        bool orderIdInMetadata = false)
    {
        var metadata = new Dictionary<string, string>();
        if (orderIdInMetadata && orderId.HasValue)
        {
            metadata["orderId"] = orderId.Value.ToString();
        }

        return JsonSerializer.Serialize(new
        {
            id = eventId ?? NewEventId(),
            @object = "event",
            type,
            data = new
            {
                @object = new
                {
                    id = "cs_test_" + Guid.NewGuid().ToString("N"),
                    @object = "checkout.session",
                    amount_total = amountMinor,
                    currency,
                    client_reference_id = orderIdInMetadata ? null : orderId?.ToString(),
                    metadata,
                    payment_intent = paymentIntent ?? "pi_" + Guid.NewGuid().ToString("N"),
                    payment_status = paymentStatus
                }
            }
        });
    }

    private static string Sign(string payload, long timestamp, string secret)
    {
        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret));
        var signature = Convert.ToHexString(hmac.ComputeHash(Encoding.UTF8.GetBytes($"{timestamp}.{payload}"))).ToLowerInvariant();
        return $"t={timestamp},v1={signature}";
    }
}
