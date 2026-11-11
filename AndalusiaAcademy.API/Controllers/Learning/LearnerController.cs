using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AndalusiaAcademy.API.Common.Security;
using AndalusiaAcademy.API.DTOs.Learning;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.API.Services.Interfaces.Learning;
using AndalusiaAcademy.API.Services.Interfaces.Storage;

namespace AndalusiaAcademy.API.Controllers.Learning;

/// <summary>
/// Learner dashboard: enrolled courses, course learning page, materials and assignment submission.
/// </summary>
[ApiController]
[Route("api/learning")]
[Produces("application/json")]
[Authorize(Policy = PermissionCodes.LearningAccess)]
public class LearnerController : ControllerBase
{
    private readonly ILearnerLearningService _learning;
    private readonly ICurrentUser _currentUser;

    public LearnerController(ILearnerLearningService learning, ICurrentUser currentUser)
    {
        _learning = learning;
        _currentUser = currentUser;
    }

    /// <summary>My Courses with next session and progress.</summary>
    [HttpGet("courses")]
    [ProducesResponseType(typeof(IReadOnlyList<MyCourseDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<MyCourseDto>>> GetMyCourses(CancellationToken cancellationToken) =>
        Ok(await _learning.GetMyCoursesAsync(_currentUser.UserId, cancellationToken));

    /// <summary>Course learning page: schedule, locations, materials, assignments, attendance and progress.</summary>
    [HttpGet("courses/{courseOfferingId:guid}")]
    [ProducesResponseType(typeof(CourseLearningDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<CourseLearningDto>> GetCourse(Guid courseOfferingId, CancellationToken cancellationToken) =>
        Ok(await _learning.GetCourseAsync(_currentUser.UserId, courseOfferingId, cancellationToken));

    /// <summary>Marks a learning resource as completed (idempotent).</summary>
    [HttpPost("resources/{resourceId:guid}/complete")]
    [ProducesResponseType(typeof(LearnerResourceDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<LearnerResourceDto>> CompleteResource(Guid resourceId, CancellationToken cancellationToken) =>
        Ok(await _learning.CompleteResourceAsync(_currentUser.UserId, resourceId, cancellationToken));

    /// <summary>Submits a new attempt for an assignment.</summary>
    [HttpPost("assignments/{assignmentId:guid}/submissions")]
    [Authorize(Policy = PermissionCodes.AssignmentsSubmit)]
    [ProducesResponseType(typeof(SubmissionDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult<SubmissionDto>> Submit(Guid assignmentId, SubmitAssignmentRequest request, CancellationToken cancellationToken)
    {
        var submission = await _learning.SubmitAssignmentAsync(_currentUser.UserId, assignmentId, request, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, submission);
    }

    /// <summary>Submits a new attempt with an optional text answer and up to 5 attached files (multipart/form-data).</summary>
    [HttpPost("assignments/{assignmentId:guid}/submissions/upload")]
    [Authorize(Policy = PermissionCodes.AssignmentsSubmit)]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(UploadLimits.MaxRequestBytes)]
    [RequestFormLimits(MultipartBodyLengthLimit = UploadLimits.MaxRequestBytes)]
    [ProducesResponseType(typeof(SubmissionDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult<SubmissionDto>> SubmitWithFiles(
        Guid assignmentId, [FromForm] SubmitAssignmentFormRequest form, CancellationToken cancellationToken)
    {
        var files = (form.Files ?? []).Select(f => new IncomingFile(f.FileName, f.Length, f.OpenReadStream)).ToList();
        var submission = await _learning.SubmitAssignmentAsync(_currentUser.UserId, assignmentId, form.Body, files, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, submission);
    }
}
