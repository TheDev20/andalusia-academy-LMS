using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AndalusiaAcademy.API.DTOs.Payments;
using AndalusiaAcademy.API.Services.Interfaces.Payments;

namespace AndalusiaAcademy.API.Controllers.Payments;

[ApiController]
[Route("api/v1/payments")]
[Authorize]
[Produces("application/json")]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentsController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    [HttpPost("attempt")]
    [ProducesResponseType(typeof(PaymentAttemptDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<PaymentAttemptDto>> SubmitPaymentAttempt(
        [FromBody] CreatePaymentAttemptRequest request,
        CancellationToken ct)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var learnerId))
        {
            return Unauthorized();
        }

        var result = await _paymentService.ProcessPaymentAttemptAsync(learnerId, request, ct);
        return Ok(result);
    }

    [HttpGet("my")]
    [ProducesResponseType(typeof(List<PaymentAttemptDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<List<PaymentAttemptDto>>> GetMyPayments(CancellationToken ct)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var learnerId))
        {
            return Unauthorized();
        }

        var result = await _paymentService.GetMyPaymentsAsync(learnerId, ct);
        return Ok(result);
    }
}
