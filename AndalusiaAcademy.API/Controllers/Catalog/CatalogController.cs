using Microsoft.AspNetCore.Mvc;
using AndalusiaAcademy.API.DTOs.Catalog;
using AndalusiaAcademy.API.DTOs.Common;
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
    private readonly ILogger<CatalogController> _logger;

    public CatalogController(
        ICatalogService catalogService,
        ILogger<CatalogController> logger)
    {
        _catalogService = catalogService;
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
    /// Retrieves detailed information for an academic program including its included courses and upcoming cohorts.
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
}
