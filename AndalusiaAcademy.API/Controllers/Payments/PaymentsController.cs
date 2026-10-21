using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AndalusiaAcademy.API.Common.Security;
using AndalusiaAcademy.API.DTOs.Payments;
using AndalusiaAcademy.API.ENUMs;
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

    public PaymentsController(IPaymentService payments, ICurrentUser currentUser)
    {
        _payments = payments;
        _currentUser = currentUser;
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
}
