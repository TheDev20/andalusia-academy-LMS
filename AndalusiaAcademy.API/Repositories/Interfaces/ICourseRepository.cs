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

    /// <summary>
    /// Fetches detailed information for a specific published course by ID or slug.
    /// </summary>
    Task<CourseDetailDto?> GetCourseDetailAsync(
        string idOrSlug,
        CancellationToken cancellationToken = default);
}
