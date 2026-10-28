using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AndalusiaAcademy.API.DTOs.Learning;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.API.Services.Interfaces.Learning;

namespace AndalusiaAcademy.API.Controllers.Learning;

/// <summary>
/// Instructor dashboard: assigned cohorts, sessions, attendance, assignments, grading and learner progress.
/// Cohort-level access (assignment to the offering) is enforced in <see cref="IInstructorService"/>.
/// </summary>
[ApiController]
[Route("api/instructor")]
[Produces("application/json")]
[Authorize(Policy = PermissionCodes.CohortsViewAssigned)]
public class InstructorController : ControllerBase
{
    private readonly IInstructorService _instructor;

    public InstructorController(IInstructorService instructor)
    {
        _instructor = instructor;
    }

    [HttpGet("cohorts")]
    [ProducesResponseType(typeof(IReadOnlyList<CohortDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<CohortDto>>> GetCohorts(CancellationToken cancellationToken) =>
        Ok(await _instructor.GetCohortsAsync(cancellationToken));

    [HttpGet("cohorts/{offeringId:guid}")]
    [ProducesResponseType(typeof(CohortDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<CohortDetailDto>> GetCohort(Guid offeringId, CancellationToken cancellationToken) =>
        Ok(await _instructor.GetCohortAsync(offeringId, cancellationToken));

    [HttpGet("cohorts/{offeringId:guid}/progress")]
    [ProducesResponseType(typeof(IReadOnlyList<LearnerProgressDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<LearnerProgressDto>>> GetProgress(Guid offeringId, CancellationToken cancellationToken) =>
        Ok(await _instructor.GetProgressAsync(offeringId, cancellationToken));

    [HttpGet("sessions/{sessionId:guid}/attendance")]
    [Authorize(Policy = PermissionCodes.AttendanceRecord)]
    [ProducesResponseType(typeof(SessionAttendanceDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<SessionAttendanceDto>> GetAttendance(Guid sessionId, CancellationToken cancellationToken) =>
        Ok(await _instructor.GetAttendanceAsync(sessionId, cancellationToken));

    /// <summary>Records or corrects attendance; changes to existing records are written to AttendanceCorrection.</summary>
    [HttpPut("sessions/{sessionId:guid}/attendance")]
    [Authorize(Policy = PermissionCodes.AttendanceRecord)]
    [ProducesResponseType(typeof(SessionAttendanceDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult<SessionAttendanceDto>> RecordAttendance(Guid sessionId, RecordAttendanceRequest request, CancellationToken cancellationToken) =>
        Ok(await _instructor.RecordAttendanceAsync(sessionId, request, cancellationToken));

    [HttpPost("cohorts/{offeringId:guid}/assignments")]
    [Authorize(Policy = PermissionCodes.AssignmentsManage)]
    [ProducesResponseType(typeof(InstructorAssignmentDto), StatusCodes.Status201Created)]
    public async Task<ActionResult<InstructorAssignmentDto>> CreateAssignment(Guid offeringId, UpsertAssignmentRequest request, CancellationToken cancellationToken)
    {
        var assignment = await _instructor.CreateAssignmentAsync(offeringId, request, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, assignment);
    }

    [HttpPut("assignments/{assignmentId:guid}")]
    [Authorize(Policy = PermissionCodes.AssignmentsManage)]
    [ProducesResponseType(typeof(InstructorAssignmentDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<InstructorAssignmentDto>> UpdateAssignment(Guid assignmentId, UpsertAssignmentRequest request, CancellationToken cancellationToken) =>
        Ok(await _instructor.UpdateAssignmentAsync(assignmentId, request, cancellationToken));

    [HttpGet("assignments/{assignmentId:guid}/submissions")]
    [Authorize(Policy = PermissionCodes.SubmissionsGrade)]
    [ProducesResponseType(typeof(IReadOnlyList<SubmissionForGradingDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<SubmissionForGradingDto>>> GetSubmissions(Guid assignmentId, CancellationToken cancellationToken) =>
        Ok(await _instructor.GetSubmissionsAsync(assignmentId, cancellationToken));

    [HttpPost("submissions/{submissionId:guid}/grade")]
    [Authorize(Policy = PermissionCodes.SubmissionsGrade)]
    [ProducesResponseType(typeof(SubmissionForGradingDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult<SubmissionForGradingDto>> Grade(Guid submissionId, GradeSubmissionRequest request, CancellationToken cancellationToken) =>
        Ok(await _instructor.GradeSubmissionAsync(submissionId, request, cancellationToken));

    [HttpPost("upload-attachment")]
    [Authorize(Policy = PermissionCodes.AssignmentsManage)]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(typeof(UploadAttachmentResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<UploadAttachmentResponse>> UploadAttachment(IFormFile file, CancellationToken cancellationToken)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "No file uploaded." });

        if (file.Length > 25 * 1024 * 1024)
            return BadRequest(new { message = "File must be under 25MB." });

        var allowedExtensions = new[] { ".pdf", ".doc", ".docx", ".txt", ".zip", ".png", ".jpg", ".jpeg" };
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(ext))
            return BadRequest(new { message = "Only documents (.pdf, .doc, .docx, .txt, .zip, .png, .jpg) are allowed." });

        var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
        Directory.CreateDirectory(uploadsDir);

        var originalName = Path.GetFileNameWithoutExtension(file.FileName);
        var safeOriginal = System.Text.RegularExpressions.Regex.Replace(originalName, @"[^a-zA-Z0-9_\-]", "");
        if (safeOriginal.Length > 30) safeOriginal = safeOriginal[..30];
        var fileName = $"{Guid.NewGuid():N}_{safeOriginal}{ext}";
        var filePath = Path.Combine(uploadsDir, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream, cancellationToken);
        }

        var url = $"/api/uploads/{fileName}";
        return Ok(new UploadAttachmentResponse(url, file.FileName, file.Length));
    }
}
