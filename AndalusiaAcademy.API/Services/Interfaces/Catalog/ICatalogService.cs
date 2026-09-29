using AndalusiaAcademy.API.Common;
using AndalusiaAcademy.API.DTOs.Catalog;

namespace AndalusiaAcademy.API.Services.Interfaces.Catalog;

public interface ICatalogService
{
    /// <summary>
    /// Retrieves paginated catalog course summaries, leveraging in-memory caching to eliminate redundant database hits.
    /// </summary>
    Task<PagedResult<CourseSummaryDto>> GetCoursesAsync(
        CatalogQueryParameters query,
        CancellationToken cancellationToken = default);
}
