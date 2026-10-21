using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AndalusiaAcademy.API.DTOs.Catalog;
using AndalusiaAcademy.API.DTOs.Common;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.API.Services.Interfaces.Catalog;

namespace AndalusiaAcademy.API.Controllers.Catalog;

/// <summary>
/// Public Catalog API endpoints for browsing, searching, and filtering courses, programs, and career paths.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class CatalogController : ControllerBase
{
    private readonly ICatalogService _catalogService;
    private readonly IOfferingCatalogService _offeringCatalogService;
    private readonly ILogger<CatalogController> _logger;

    public CatalogController(
        ICatalogService catalogService,
        IOfferingCatalogService offeringCatalogService,
        ILogger<CatalogController> logger)
    {
        _catalogService = catalogService;
        _offeringCatalogService = offeringCatalogService;
        _logger = logger;
    }

    /// <summary>
    /// Searches and filters published courses with server-side pagination and 5-minute memory caching.
    /// </summary>
    [HttpGet("courses")]
    [ProducesResponseType(typeof(PagedResult<CourseSummaryDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedResult<CourseSummaryDto>>> GetCourses(
        [FromQuery] CatalogQueryParameters query,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Course search: SearchTerm='{SearchTerm}', CategoryId='{CategoryId}', Page={PageNumber}, Size={PageSize}",
            query.SearchTerm, query.CategoryId, query.PageNumber, query.PageSize);

        var result = await _catalogService.GetCoursesAsync(query, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Retrieves detailed information for a single course by GUID or slug.
    /// </summary>
    [HttpGet("courses/{idOrSlug}")]
    [ProducesResponseType(typeof(CourseDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CourseDetailDto>> GetCourseDetail(
        string idOrSlug,
        CancellationToken cancellationToken)
    {
        var result = await _catalogService.GetCourseDetailAsync(idOrSlug, cancellationToken);
        if (result == null) return NotFound(new { message = $"Course '{idOrSlug}' was not found." });

        return Ok(result);
    }

    /// <summary>
    /// Lists the open (published, not yet started) offerings of a published course with live seat availability.
    /// The returned offering id is what the Apply action submits to <c>POST /api/applications</c>.
    /// </summary>
    /// <param name="slug">Course slug.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <response code="200">Open offerings ordered by start date.</response>
    /// <response code="404">The course does not exist or is not published.</response>
    [HttpGet("courses/{slug}/offerings")]
    [ProducesResponseType(typeof(IReadOnlyList<OpenOfferingDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IReadOnlyList<OpenOfferingDto>>> GetOpenOfferings(string slug, CancellationToken cancellationToken)
    {
        var offerings = await _offeringCatalogService.GetOpenOfferingsAsync(slug, cancellationToken);
        return Ok(offerings);
    }

    /// <summary>
    /// Searches and filters published academic programs with server-side pagination and 5-minute memory caching.
    /// </summary>
    [HttpGet("programs")]
    [ProducesResponseType(typeof(PagedResult<ProgramSummaryDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedResult<ProgramSummaryDto>>> GetPrograms(
        [FromQuery] CatalogQueryParameters query,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Program search: SearchTerm='{SearchTerm}', CategoryId='{CategoryId}', Page={PageNumber}, Size={PageSize}",
            query.SearchTerm, query.CategoryId, query.PageNumber, query.PageSize);

        var result = await _catalogService.GetProgramsAsync(query, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Retrieves detailed information for an academic program including its included courses and upcoming cohorts
    /// </summary>
    [HttpGet("programs/{idOrSlug}")]
    [ProducesResponseType(typeof(ProgramDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProgramDetailDto>> GetProgramDetail(
        string idOrSlug,
        CancellationToken cancellationToken)
    {
        var result = await _catalogService.GetProgramDetailAsync(idOrSlug, cancellationToken);
        if (result == null) return NotFound(new { message = $"Program '{idOrSlug}' was not found." });

        return Ok(result);
    }

    /// <summary>
    /// Retrieves all published career paths with enrolled program counts.
    /// </summary>
    [HttpGet("career-paths")]
    [ProducesResponseType(typeof(List<CareerPathSummaryDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<CareerPathSummaryDto>>> GetCareerPaths(
        CancellationToken cancellationToken)
    {
        var result = await _catalogService.GetCareerPathsAsync(cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Retrieves detailed information for a career path with its recommended programs and courses.
    /// </summary>
    [HttpGet("career-paths/{idOrSlug}")]
    [ProducesResponseType(typeof(CareerPathDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CareerPathDetailDto>> GetCareerPathDetail(
        string idOrSlug,
        CancellationToken cancellationToken)
    {
        var result = await _catalogService.GetCareerPathDetailAsync(idOrSlug, cancellationToken);
        if (result == null) return NotFound(new { message = $"Career Path '{idOrSlug}' was not found." });

        return Ok(result);
    }

    /// <summary>
    /// Retrieves all Tech Disciplines with live program counts for the homepage cards (cached for 5 minutes)
    /// </summary>
    /// <param name="ct">Cancellation token</param>
    /// <response code="200">List of disciplines returned successfully</response>
    [HttpGet("disciplines")]
    [ProducesResponseType(typeof(List<TechDisciplineDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<TechDisciplineDto>>> GetDisciplines(CancellationToken ct)
    {
        var disciplines = await _catalogService.GetDisciplinesAsync(ct);
        return Ok(disciplines);
    }

    /// <summary>
    /// Adds a new Tech Discipline (requires the courses.manage permission)
    /// </summary>
    /// <param name="request">Discipline title, description, and icon name</param>
    /// <param name="ct">Cancellation token</param>
    /// <response code="201">Discipline created successfully and visible on frontend</response>
    /// <response code="400">Validation error occurred</response>
    /// <response code="409">A discipline with this title already exists</response>
    [HttpPost("disciplines")]
    [Authorize(Policy = PermissionCodes.CoursesManage)]
    [ProducesResponseType(typeof(TechDisciplineDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<TechDisciplineDto>> CreateDiscipline(
        [FromBody] CreateTechDisciplineRequest request,
        CancellationToken ct)
    {
        var result = await _catalogService.CreateDisciplineAsync(request, ct);
        return CreatedAtAction(nameof(GetDisciplines), new { id = result.Id }, result);
    }

    /// <summary>
    /// Updates an existing Tech Discipline (requires the courses.manage permission).
    /// </summary>
    /// <param name="id">The discipline Guid identifier</param>
    /// <param name="request">Discipline title, description, and icon name</param>
    /// <param name="ct">Cancellation token</param>
    /// <response code="204">Discipline updated successfully and visible on frontend</response>
    /// <response code="400">Validation error occurred</response>
    /// <response code="404">Discipline not found</response>
    /// <response code="409">Another discipline with this title already exists</response>
    [HttpPut("disciplines/{id:guid}")]
    [Authorize(Policy = PermissionCodes.CoursesManage)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> UpdateDiscipline(
        Guid id,
        [FromBody] UpdateTechDisciplineRequest request,
        CancellationToken ct)
    {
        await _catalogService.UpdateDisciplineAsync(id, request, ct);
        return NoContent();
    }
}
