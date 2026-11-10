using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using AndalusiaAcademy.API.Data;
using AndalusiaAcademy.API.Exceptions;
using AndalusiaAcademy.API.Models.Payments;
using AndalusiaAcademy.API.Services.Interfaces.Payments;

namespace AndalusiaAcademy.API.Services.Implementations.Payments;

public sealed class StripeWebhookService : IStripeWebhookService
{
    public const string Provider = "Stripe";

    private const string StatusReceived = "Received";
    private const string StatusProcessed = "Processed";
    private const string StatusFailed = "Failed";
    private const int MaxErrorLength = 2000;

    private readonly ApplicationDbContext _context;
    private readonly IPaymentService _payments;
    private readonly PaymentOptions _options;
    private readonly TimeProvider _clock;
    private readonly ILogger<StripeWebhookService> _logger;

    public StripeWebhookService(
        ApplicationDbContext context,
        IPaymentService payments,
        IOptions<PaymentOptions> options,
        TimeProvider clock,
        ILogger<StripeWebhookService> logger)
    {
        _context = context;
        _payments = payments;
        _options = options.Value;
        _clock = clock;
        _logger = logger;
    }

    public async Task<StripeWebhookOutcome> HandleAsync(string payload, string? signatureHeader, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_options.StripeWebhookSecret))
        {
            _logger.LogError("Stripe webhook received but Payments:StripeWebhookSecret is not configured.");
            return StripeWebhookOutcome.NotConfigured;
        }

        if (!StripeSignatureVerifier.IsValid(payload, signatureHeader, _options.StripeWebhookSecret, _clock.GetUtcNow()))
        {
            _logger.LogWarning("Rejected a Stripe webhook delivery with a missing, stale or invalid signature.");
            return StripeWebhookOutcome.InvalidSignature;
        }

        using var document = ParseEvent(payload);
        var root = document.RootElement;
        var eventId = GetString(root, "id");
        var eventType = GetString(root, "type");
        if (string.IsNullOrWhiteSpace(eventId) || string.IsNullOrWhiteSpace(eventType))
        {
            throw new BusinessRuleException("Stripe event id and type are required.");
        }

        var inboxId = await RecordDeliveryAsync(eventId, payload, cancellationToken);
        if (inboxId is null)
        {
            return StripeWebhookOutcome.Acknowledged;
        }

        try
        {
            await DispatchAsync(root, eventId, eventType, cancellationToken);
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            // The failure may have rolled back a transaction; never reuse the tracked state.
            _context.ChangeTracker.Clear();
            _logger.LogError(ex, "Stripe event {EventId} ({EventType}) could not be processed", eventId, eventType);
            await MarkAsync(inboxId.Value, StatusFailed, Truncate(ex.Message), CancellationToken.None);
            throw;
        }

        await MarkAsync(inboxId.Value, StatusProcessed, null, cancellationToken);
        return StripeWebhookOutcome.Acknowledged;
    }

    /// <summary>
    /// Durably records the delivery before any processing, in its own commit so a failed settlement
    /// cannot roll it back. Returns null when the event was already processed.
    /// </summary>
    private async Task<Guid?> RecordDeliveryAsync(string eventId, string payload, CancellationToken cancellationToken)
    {
        var inbox = await _context.WebhookInboxes
            .FirstOrDefaultAsync(w => w.Provider == Provider && w.ProviderEventId == eventId, cancellationToken);
        if (inbox?.Status == StatusProcessed)
        {
            return null;
        }

        if (inbox is null)
        {
            inbox = new WebhookInbox
            {
                Provider = Provider,
                ProviderEventId = eventId,
                PayloadJson = payload,
                ReceivedAt = _clock.GetUtcNow()
            };
            _context.WebhookInboxes.Add(inbox);
        }

        inbox.AttemptCount++;
        inbox.Status = StatusReceived;
        // Concurrent deliveries of one event collide on the unique (Provider, ProviderEventId) index
        // or the row version; the loser is answered 409 and Stripe redelivers.
        await _context.SaveChangesAsync(cancellationToken);
        return inbox.Id;
    }

    private Task MarkAsync(Guid inboxId, string status, string? error, CancellationToken cancellationToken)
    {
        DateTimeOffset? processedAt = status == StatusProcessed ? _clock.GetUtcNow() : null;
        return _context.WebhookInboxes
            .Where(w => w.Id == inboxId)
            .ExecuteUpdateAsync(s => s
                .SetProperty(w => w.Status, status)
                .SetProperty(w => w.LastError, error)
                .SetProperty(w => w.ProcessedAt, processedAt), cancellationToken);
    }

    private async Task DispatchAsync(JsonElement root, string eventId, string eventType, CancellationToken cancellationToken)
    {
        switch (eventType)
        {
            // Card payments complete with payment_status "paid"; delayed methods report "unpaid" here
            // and confirm later through async_payment_succeeded.
            case "checkout.session.completed":
            case "checkout.session.async_payment_succeeded":
                var session = GetSession(root);
                if (GetString(session, "payment_status") == "paid")
                {
                    await SettleCheckoutSessionAsync(session, eventId, cancellationToken);
                }

                break;
            default:
                _logger.LogDebug("Ignoring Stripe event {EventId} of type {EventType}", eventId, eventType);
                break;
        }
    }

    private Task SettleCheckoutSessionAsync(JsonElement session, string eventId, CancellationToken cancellationToken)
    {
        var orderIdText = session.TryGetProperty("metadata", out var metadata) && metadata.ValueKind == JsonValueKind.Object
            ? GetString(metadata, "orderId")
            : null;
        orderIdText ??= GetString(session, "client_reference_id");
        if (!Guid.TryParse(orderIdText, out var orderId))
        {
            throw new BusinessRuleException(
                "Stripe checkout session must contain a valid LMS order ID in client_reference_id or metadata.orderId.");
        }

        var currency = GetString(session, "currency");
        if (!session.TryGetProperty("amount_total", out var amountTotal)
            || amountTotal.ValueKind != JsonValueKind.Number
            || !amountTotal.TryGetInt64(out var amountTotalMinor)
            || string.IsNullOrWhiteSpace(currency))
        {
            throw new BusinessRuleException("Stripe checkout session amount and currency are required.");
        }

        var paymentId = GetString(session, "payment_intent") ?? GetString(session, "id");
        if (string.IsNullOrWhiteSpace(paymentId))
        {
            throw new BusinessRuleException("Stripe checkout session id is missing.");
        }

        return _payments.SettleStripePaymentAsync(orderId, paymentId, eventId, amountTotalMinor, currency, cancellationToken);
    }

    private static JsonDocument ParseEvent(string payload)
    {
        try
        {
            var document = JsonDocument.Parse(payload);
            if (document.RootElement.ValueKind == JsonValueKind.Object)
            {
                return document;
            }

            document.Dispose();
        }
        catch (JsonException)
        {
            // Reported below.
        }

        throw new BusinessRuleException("Stripe event payload is not a JSON object.");
    }

    private static JsonElement GetSession(JsonElement root) =>
        root.TryGetProperty("data", out var data)
        && data.ValueKind == JsonValueKind.Object
        && data.TryGetProperty("object", out var session)
        && session.ValueKind == JsonValueKind.Object
            ? session
            : throw new BusinessRuleException("Stripe event does not contain a checkout session.");

    /// <summary>Reads a string property, treating missing, null and non-string values alike.</summary>
    private static string? GetString(JsonElement element, string name) =>
        element.TryGetProperty(name, out var value) && value.ValueKind == JsonValueKind.String
            ? value.GetString()
            : null;

    private static string Truncate(string message) =>
        message.Length <= MaxErrorLength ? message : message[..MaxErrorLength];
}
