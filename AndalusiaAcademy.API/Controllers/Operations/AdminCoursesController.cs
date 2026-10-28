using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AndalusiaAcademy.API.DTOs.Common;
using AndalusiaAcademy.API.DTOs.Operations;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.API.Services.Interfaces.Operations;

namespace AndalusiaAcademy.API.Controllers.Operations;

[ApiController]
[Route("api/admin/courses")]
[Produces("application/json")]
[Authorize(Policy = PermissionCodes.CoursesManage)]
public class AdminCoursesController : ControllerBase
{
    private readonly IAdminCourseService _courses;

    public AdminCoursesController(IAdminCourseService courses)
    {
        _courses = courses;
    }

    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<AdminCourseDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedResult<AdminCourseDto>>> List([FromQuery] AdminListQuery query, CancellationToken cancellationToken) =>
        Ok(await _courses.ListAsync(query, cancellationToken));

    [HttpGet("{courseId:guid}")]
    [ProducesResponseType(typeof(AdminCourseDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<AdminCourseDto>> Get(Guid courseId, CancellationToken cancellationToken) =>
        Ok(await _courses.GetAsync(courseId, cancellationToken));

    [HttpPost]
    [ProducesResponseType(typeof(AdminCourseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<AdminCourseDto>> Create(UpsertCourseRequest request, CancellationToken cancellationToken)
    {
        var course = await _courses.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(Get), new { courseId = course.Id }, course);
    }

    [HttpPut("{courseId:guid}")]
    [ProducesResponseType(typeof(AdminCourseDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<AdminCourseDto>> Update(Guid courseId, UpsertCourseRequest request, CancellationToken cancellationToken) =>
        Ok(await _courses.UpdateAsync(courseId, request, cancellationToken));

    /// <summary>Deletes a course that was never scheduled; otherwise set PublicationStatus to Archived.</summary>
    [HttpDelete("{courseId:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Delete(Guid courseId, CancellationToken cancellationToken)
    {
        await _courses.DeleteAsync(courseId, cancellationToken);
        return NoContent();
    }

    [HttpPost("upload-image")]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(typeof(UploadImageResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<UploadImageResponse>> UploadImage(IFormFile file, CancellationToken cancellationToken)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "No file uploaded." });

        if (file.Length > 10 * 1024 * 1024)
            return BadRequest(new { message = "Image must be under 10MB." });

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp", ".gif" };
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(ext))
            return BadRequest(new { message = "Only image files (.jpg, .jpeg, .png, .webp, .gif) are allowed." });

        var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
        Directory.CreateDirectory(uploadsDir);

        var fileName = $"{Guid.NewGuid():N}{ext}";
        var filePath = Path.Combine(uploadsDir, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream, cancellationToken);
        }

        var url = $"/api/uploads/{fileName}";
        return Ok(new UploadImageResponse(url));
    }
}
