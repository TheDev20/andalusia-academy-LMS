using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AndalusiaAcademy.API.Common.Security;
using AndalusiaAcademy.API.DTOs.Admissions;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.API.Services.Interfaces.Admissions;

namespace AndalusiaAcademy.API.Controllers.Admissions;

/// <summary>
/// The learner's enrollments (My Courses / My Programs at enrollment level).
/// </summary>
[ApiController]
[Route("api/enrollments")]
[Produces("application/json")]
[Authorize(Policy = PermissionCodes.LearningAccess)]
public class EnrollmentsController : ControllerBase
{
    private readonly IEnrollmentService _enrollments;
    private readonly ICurrentUser _currentUser;

    public EnrollmentsController(IEnrollmentService enrollments, ICurrentUser currentUser)
    {
        _enrollments = enrollments;
        _currentUser = currentUser;
    }

    [HttpGet("mine")]
    [ProducesResponseType(typeof(IReadOnlyList<EnrollmentDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<EnrollmentDto>>> GetMine(CancellationToken cancellationToken) =>
        Ok(await _enrollments.GetForLearnerAsync(_currentUser.UserId, cancellationToken));
}
