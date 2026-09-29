using AndalusiaAcademy.API.Common;
using AndalusiaAcademy.API.DTOs.Catalog;

namespace AndalusiaAcademy.API.Repositories.Interfaces;

public interface ICourseRepository
{
    /// <summary>
    /// Fetches a paginated, read-only projected list of published courses matching search and filter criteria.
    /// </summary>
    Task<PagedResult<CourseSummaryDto>> GetCatalogCoursesAsync(
        CatalogQueryParameters query,
        CancellationToken cancellationToken = default);
}
