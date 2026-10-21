using AndalusiaAcademy.API.DTOs.Catalog;
using AndalusiaAcademy.API.DTOs.Common;

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
