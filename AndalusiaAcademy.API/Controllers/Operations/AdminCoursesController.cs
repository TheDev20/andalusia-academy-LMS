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
}
