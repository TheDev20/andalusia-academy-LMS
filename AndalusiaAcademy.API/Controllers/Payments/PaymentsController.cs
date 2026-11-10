using System.ComponentModel.DataAnnotations;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AndalusiaAcademy.API.Common.Security;
using AndalusiaAcademy.API.DTOs.Payments;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.API.Services.Interfaces.Payments;

namespace AndalusiaAcademy.API.Controllers.Payments;

/// <summary>
/// Checkout, the approved payment simulation, My Payments and the Stripe webhook.
/// </summary>
[ApiController]
[Route("api/payments")]
[Produces("application/json")]
[Authorize(Policy = PermissionCodes.PaymentsPayOwn)]
public class PaymentsController : ControllerBase
{
    private const int MaxWebhookPayloadBytes = 512 * 1024;

    private readonly IPaymentService _payments;
    private readonly ICurrentUser _currentUser;
    private readonly IStripeWebhookService _stripeWebhooks;

    public PaymentsController(
        IPaymentService payments,
        ICurrentUser currentUser,
        IStripeWebhookService stripeWebhooks)
    {
        _payments = payments;
        _currentUser = currentUser;
        _stripeWebhooks = stripeWebhooks;
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
    /// Any non-2xx answer makes Stripe redeliver the event.
    /// </summary>
    [AllowAnonymous]
    [HttpPost("webhook")]
    [RequestSizeLimit(MaxWebhookPayloadBytes)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
    public async Task<IActionResult> StripeWebhook(CancellationToken cancellationToken)
    {
        // The signature covers the exact bytes Stripe sent, so the body is read raw rather than model-bound.
        using var reader = new StreamReader(Request.Body, Encoding.UTF8);
        var payload = await reader.ReadToEndAsync(cancellationToken);

        var outcome = await _stripeWebhooks.HandleAsync(payload, Request.Headers["Stripe-Signature"].ToString(), cancellationToken);
        return outcome switch
        {
            StripeWebhookOutcome.Acknowledged => Ok(),
            StripeWebhookOutcome.InvalidSignature => Problem(
                statusCode: StatusCodes.Status400BadRequest, title: "Invalid Stripe signature"),
            _ => Problem(
                statusCode: StatusCodes.Status503ServiceUnavailable, title: "Stripe webhooks are not configured")
        };
    }
}
