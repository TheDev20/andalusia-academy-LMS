using AndalusiaAcademy.API.DTOs.Catalog;
using AndalusiaAcademy.API.DTOs.Common;

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
