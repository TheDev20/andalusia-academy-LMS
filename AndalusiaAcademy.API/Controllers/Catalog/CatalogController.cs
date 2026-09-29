using Microsoft.AspNetCore.Mvc;
using AndalusiaAcademy.API.Common;
using AndalusiaAcademy.API.DTOs.Catalog;
using AndalusiaAcademy.API.Services.Interfaces.Catalog;

namespace AndalusiaAcademy.API.Controllers.Catalog;


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
}
