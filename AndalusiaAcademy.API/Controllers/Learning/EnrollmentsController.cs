using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AndalusiaAcademy.API.DTOs.Learning;
using AndalusiaAcademy.API.Services.Interfaces.Admissions;

namespace AndalusiaAcademy.API.Controllers.Learning;

[ApiController]
[Route("api/v1/enrollments")]
[Authorize]
[Produces("application/json")]
public class EnrollmentsController : ControllerBase
{
    private readonly IAdmissionsService _admissionsService;

    public EnrollmentsController(IAdmissionsService admissionsService)
    {
        _admissionsService = admissionsService;
    }

    [HttpGet("my-learning")]
    [ProducesResponseType(typeof(List<EnrolledCourseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<List<EnrolledCourseDto>>> GetMyLearning(CancellationToken ct)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var learnerId))
        {
            return Unauthorized();
        }

        var result = await _admissionsService.GetMyLearningAsync(learnerId, ct);
        return Ok(result);
    }
}
