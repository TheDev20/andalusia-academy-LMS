using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AndalusiaAcademy.API.DTOs.Operations;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.API.Services.Interfaces.Operations;

namespace AndalusiaAcademy.API.Controllers.Operations;

/// <summary>
/// Locations and session schedules.
/// </summary>
[ApiController]
[Route("api/admin")]
[Produces("application/json")]
[Authorize(Policy = PermissionCodes.SchedulesManage)]
public class AdminSchedulesController : ControllerBase
{
    private readonly IAdminScheduleService _schedules;

    public AdminSchedulesController(IAdminScheduleService schedules)
    {
        _schedules = schedules;
    }

    [HttpGet("locations")]
    [ProducesResponseType(typeof(IReadOnlyList<AdminLocationDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<AdminLocationDto>>> ListLocations(CancellationToken cancellationToken) =>
        Ok(await _schedules.ListLocationsAsync(cancellationToken));

    [HttpPost("locations")]
    [ProducesResponseType(typeof(AdminLocationDto), StatusCodes.Status201Created)]
    public async Task<ActionResult<AdminLocationDto>> CreateLocation(UpsertLocationRequest request, CancellationToken cancellationToken)
    {
        var location = await _schedules.CreateLocationAsync(request, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, location);
    }

    [HttpPut("locations/{locationId:guid}")]
    [ProducesResponseType(typeof(AdminLocationDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<AdminLocationDto>> UpdateLocation(Guid locationId, UpsertLocationRequest request, CancellationToken cancellationToken) =>
        Ok(await _schedules.UpdateLocationAsync(locationId, request, cancellationToken));

    [HttpGet("offerings/{offeringId:guid}/sessions")]
    [ProducesResponseType(typeof(IReadOnlyList<AdminSessionDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<AdminSessionDto>>> ListSessions(Guid offeringId, CancellationToken cancellationToken) =>
        Ok(await _schedules.ListSessionsAsync(offeringId, cancellationToken));

    [HttpPost("offerings/{offeringId:guid}/sessions")]
    [ProducesResponseType(typeof(AdminSessionDto), StatusCodes.Status201Created)]
    public async Task<ActionResult<AdminSessionDto>> CreateSession(Guid offeringId, UpsertSessionRequest request, CancellationToken cancellationToken)
    {
        var session = await _schedules.CreateSessionAsync(offeringId, request, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, session);
    }

    [HttpPut("sessions/{sessionId:guid}")]
    [ProducesResponseType(typeof(AdminSessionDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<AdminSessionDto>> UpdateSession(Guid sessionId, UpsertSessionRequest request, CancellationToken cancellationToken) =>
        Ok(await _schedules.UpdateSessionAsync(sessionId, request, cancellationToken));

    [HttpDelete("sessions/{sessionId:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> DeleteSession(Guid sessionId, CancellationToken cancellationToken)
    {
        await _schedules.DeleteSessionAsync(sessionId, cancellationToken);
        return NoContent();
    }
}
