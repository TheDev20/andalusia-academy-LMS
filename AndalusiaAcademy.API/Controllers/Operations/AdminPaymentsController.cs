using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AndalusiaAcademy.API.DTOs.Common;
using AndalusiaAcademy.API.DTOs.Operations;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.API.Services.Interfaces.Operations;

namespace AndalusiaAcademy.API.Controllers.Operations;

[ApiController]
[Route("api/admin/payments")]
[Produces("application/json")]
[Authorize(Policy = PermissionCodes.PaymentsManage)]
public class AdminPaymentsController : ControllerBase
{
    private readonly IAdminPaymentService _payments;

    public AdminPaymentsController(IAdminPaymentService payments)
    {
        _payments = payments;
    }

    /// <summary>Lists sales orders; filter by status or learner e-mail.</summary>
    [HttpGet("orders")]
    [ProducesResponseType(typeof(PagedResult<AdminOrderDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedResult<AdminOrderDto>>> ListOrders([FromQuery] AdminOrderQuery query, CancellationToken cancellationToken) =>
        Ok(await _payments.ListOrdersAsync(query, cancellationToken));
}
