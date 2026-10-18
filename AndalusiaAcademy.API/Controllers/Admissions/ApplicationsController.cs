using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AndalusiaAcademy.API.DTOs.Admissions;
using AndalusiaAcademy.API.Services.Interfaces.Admissions;

namespace AndalusiaAcademy.API.Controllers.Admissions;

[ApiController]
[Route("api/v1/applications")]
[Authorize]
[Produces("application/json")]
public class ApplicationsController : ControllerBase
{
    private readonly IAdmissionsService _admissionsService;

    public ApplicationsController(IAdmissionsService admissionsService)
    {
        _admissionsService = admissionsService;
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApplicationDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<ApplicationDto>> SubmitApplication(
        [FromBody] CreateApplicationRequest request,
        CancellationToken ct)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var learnerId))
        {
            return Unauthorized();
        }

        var result = await _admissionsService.SubmitApplicationAsync(learnerId, request, ct);
        return StatusCode(StatusCodes.Status201Created, result);
    }

    [HttpGet("my")]
    [ProducesResponseType(typeof(List<ApplicationDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<List<ApplicationDto>>> GetMyApplications(CancellationToken ct)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var learnerId))
        {
            return Unauthorized();
        }

        var result = await _admissionsService.GetMyApplicationsAsync(learnerId, ct);
        return Ok(result);
    }
}
