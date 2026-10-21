using Microsoft.AspNetCore.Mvc;
using AndalusiaAcademy.API.DTOs.Catalog;
using AndalusiaAcademy.API.DTOs.Common;
using AndalusiaAcademy.API.Services.Interfaces.Catalog;

namespace AndalusiaAcademy.API.Controllers.Catalog;

/// <summary>
/// Public Catalog API endpoints for browsing, searching, and filtering published educational offerings.
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
    /// <param name="query">Filter parameters including SearchTerm, CategoryId, PageNumber, and PageSize.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <response code="200">Returns the paginated course summaries.</response>
    [HttpGet("courses")]
    [ProducesResponseType(typeof(PagedResult<CourseSummaryDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedResult<CourseSummaryDto>>> GetCourses(
        [FromQuery] CatalogQueryParameters query,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Catalog search request: SearchTerm='{SearchTerm}', CategoryId='{CategoryId}', Page={PageNumber}, Size={PageSize}",
            query.SearchTerm, query.CategoryId, query.PageNumber, query.PageSize);

        var result = await _catalogService.GetCoursesAsync(query, cancellationToken);
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
}
