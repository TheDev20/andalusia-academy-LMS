using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AndalusiaAcademy.API.Common.Security;
using AndalusiaAcademy.API.Data;
using AndalusiaAcademy.API.DTOs.Payments;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.API.Models.Payments;
using AndalusiaAcademy.API.Services.Implementations.Payments;
using AndalusiaAcademy.API.Services.Interfaces.Payments;

namespace AndalusiaAcademy.API.Controllers.Payments;

/// <summary>
/// Checkout and the approved payment simulation, plus My Payments.
/// </summary>
[ApiController]
[Route("api/payments")]
[Produces("application/json")]
[Authorize(Policy = PermissionCodes.PaymentsPayOwn)]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _payments;
    private readonly ICurrentUser _currentUser;
    private readonly ApplicationDbContext _context;
    private readonly PaymentOptions _options;

    public PaymentsController(
        IPaymentService payments,
        ICurrentUser currentUser,
        ApplicationDbContext context,
        Microsoft.Extensions.Options.IOptions<PaymentOptions> options)
    {
        _payments = payments;
        _currentUser = currentUser;
        _context = context;
        _options = options.Value;
    }

    /// <summary>Creates the sales order for a submitted application (idempotent per application).</summary>
    [HttpPost("orders")]
    [ProducesResponseType(typeof(OrderDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult<OrderDto>> CreateOrder(CreateOrderRequest request, CancellationToken cancellationToken) =>
        Ok(await _payments.CreateOrderAsync(_currentUser.UserId, request, cancellationToken));

    /// <summary>
    /// Pays an order through the payment simulation. Requires an <c>Idempotency-Key</c> header;
    /// retries with the same key return the original result without charging twice.
    /// </summary>
    [HttpPost("orders/{orderId:guid}/simulate")]
    [ProducesResponseType(typeof(PaymentResultDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
    public async Task<ActionResult<PaymentResultDto>> Simulate(
        Guid orderId,
        SimulatePaymentRequest request,
        [FromHeader(Name = "Idempotency-Key"), Required, StringLength(100, MinimumLength = 8)] string idempotencyKey,
        CancellationToken cancellationToken) =>
        Ok(await _payments.PayWithSimulationAsync(_currentUser.UserId, orderId, request, idempotencyKey.Trim(), cancellationToken));

    /// <summary>My Payments: orders and their payment attempts.</summary>
    [HttpGet("mine")]
    [ProducesResponseType(typeof(IReadOnlyList<OrderDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<OrderDto>>> GetMine(CancellationToken cancellationToken) =>
        Ok(await _payments.GetForLearnerAsync(_currentUser.UserId, cancellationToken));

    /// <summary>
    /// Receives signed Stripe events. Stripe must send the LMS order ID as client_reference_id or metadata.orderId.
    /// </summary>
    [AllowAnonymous]
    [HttpPost("webhook")]
    [Consumes("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> StripeWebhook(CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(_options.StripeWebhookSecret))
        {
            return StatusCode(StatusCodes.Status503ServiceUnavailable, "Stripe webhook secret is not configured.");
        }

        using var reader = new StreamReader(Request.Body);
        var payload = await reader.ReadToEndAsync(cancellationToken);
        if (!IsValidStripeSignature(payload, Request.Headers["Stripe-Signature"].ToString(), _options.StripeWebhookSecret))
        {
            return Unauthorized();
        }

        using var document = JsonDocument.Parse(payload);
        var root = document.RootElement;
        var eventId = root.GetProperty("id").GetString();
        var eventType = root.GetProperty("type").GetString();
        if (string.IsNullOrWhiteSpace(eventId) || string.IsNullOrWhiteSpace(eventType))
        {
            return BadRequest("Stripe event id and type are required.");
        }

        var inbox = await _context.WebhookInboxes
            .FirstOrDefaultAsync(w => w.Provider == "Stripe" && w.ProviderEventId == eventId, cancellationToken);
        if (inbox?.Status == "Processed")
        {
            return Ok();
        }

        inbox ??= new WebhookInbox
        {
            Provider = "Stripe",
            ProviderEventId = eventId,
            PayloadJson = payload,
            ReceivedAt = DateTimeOffset.UtcNow
        };
        inbox.AttemptCount++;
        inbox.Status = "Received";
        if (_context.Entry(inbox).State == EntityState.Detached)
        {
            _context.WebhookInboxes.Add(inbox);
        }

        try
        {
            if (eventType == "checkout.session.completed")
            {
                var session = root.GetProperty("data").GetProperty("object");
                var paymentStatus = session.GetProperty("payment_status").GetString();
                if (paymentStatus == "paid")
                {
                    await SettleCheckoutSessionAsync(session, eventId, cancellationToken);
                }
            }

            inbox.Status = "Processed";
            inbox.ProcessedAt = DateTimeOffset.UtcNow;
            inbox.LastError = null;
            await _context.SaveChangesAsync(cancellationToken);
            return Ok();
        }
        catch (Exception ex)
        {
            inbox.Status = "Failed";
            inbox.LastError = ex.Message;
            await _context.SaveChangesAsync(cancellationToken);
            throw;
        }
    }

    private async Task SettleCheckoutSessionAsync(
        JsonElement session,
        string eventId,
        CancellationToken cancellationToken)
    {
        var metadata = session.GetProperty("metadata");
        var orderIdText = metadata.TryGetProperty("orderId", out var metadataOrderId)
            ? metadataOrderId.GetString()
            : session.TryGetProperty("client_reference_id", out var clientReferenceId)
                ? clientReferenceId.GetString()
                : null;
        if (!Guid.TryParse(orderIdText, out var orderId))
        {
            throw new InvalidOperationException(
                "Stripe checkout session must contain a valid LMS order ID in client_reference_id or metadata.orderId.");
        }

        if (!session.TryGetProperty("amount_total", out var amountTotal)
            || !amountTotal.TryGetInt64(out var amountTotalMinor)
            || !session.TryGetProperty("currency", out var currencyElement)
            || string.IsNullOrWhiteSpace(currencyElement.GetString()))
        {
            throw new InvalidOperationException("Stripe checkout session amount and currency are required.");
        }

        var paymentId = session.TryGetProperty("payment_intent", out var paymentIntent)
            ? paymentIntent.GetString()
            : null;
        if (string.IsNullOrWhiteSpace(paymentId))
        {
            paymentId = session.GetProperty("id").GetString()
                ?? throw new InvalidOperationException("Stripe checkout session id is missing.");
        }

        await _payments.SettleStripePaymentAsync(
            orderId,
            paymentId,
            eventId,
            amountTotalMinor,
            currencyElement.GetString()!,
            cancellationToken);
    }

    private static bool IsValidStripeSignature(string payload, string signatureHeader, string secret)
    {
        var timestamp = signatureHeader
            .Split(',', StringSplitOptions.RemoveEmptyEntries)
            .FirstOrDefault(part => part.StartsWith("t=", StringComparison.Ordinal))?
            .Split('=', 2)[1];
        var signature = signatureHeader
            .Split(',', StringSplitOptions.RemoveEmptyEntries)
            .Where(part => part.StartsWith("v1=", StringComparison.Ordinal))
            .Select(part => part.Split('=', 2)[1])
            .FirstOrDefault();

        if (!long.TryParse(timestamp, out var unixTimestamp)
            || string.IsNullOrWhiteSpace(signature)
            || Math.Abs(DateTimeOffset.UtcNow.ToUnixTimeSeconds() - unixTimestamp) > 300)
        {
            return false;
        }

        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret));
        var expected = Convert.ToHexString(
            hmac.ComputeHash(Encoding.UTF8.GetBytes($"{timestamp}.{payload}"))).ToLowerInvariant();
        return CryptographicOperations.FixedTimeEquals(
            Encoding.UTF8.GetBytes(expected),
            Encoding.UTF8.GetBytes(signature));
    }
}
