using AndalusiaAcademy.API.DTOs.Catalog;
using AndalusiaAcademy.API.DTOs.Common;

namespace AndalusiaAcademy.API.Services.Interfaces.Catalog;

public interface ICatalogService
{
    /// <summary>
    /// Retrieves paginated catalog course summaries with 5-minute memory caching.
    /// </summary>
    Task<PagedResult<CourseSummaryDto>> GetCoursesAsync(
        CatalogQueryParameters query,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves detailed course information with memory caching.
    /// </summary>
    Task<CourseDetailDto?> GetCourseDetailAsync(
        string idOrSlug,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves paginated academic programs with memory caching.
    /// </summary>
    Task<PagedResult<ProgramSummaryDto>> GetProgramsAsync(
        CatalogQueryParameters query,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves detailed program information with included courses and offerings.
    /// </summary>
    Task<ProgramDetailDto?> GetProgramDetailAsync(
        string idOrSlug,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves all career paths with memory caching.
    /// </summary>
    Task<List<CareerPathSummaryDto>> GetCareerPathsAsync(
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves detailed career path information with recommended programs and courses.
    /// </summary>
    Task<CareerPathDetailDto?> GetCareerPathDetailAsync(
        string idOrSlug,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves all Tech Disciplines with live program counts and 5-minute memory caching.
    /// </summary>
    Task<List<TechDisciplineDto>> GetDisciplinesAsync(
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Creates a new Tech Discipline and immediately invalidates the disciplines cache.
    /// </summary>
    Task<TechDisciplineDto> CreateDisciplineAsync(
        CreateTechDisciplineRequest request,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing Tech Discipline and immediately invalidates the disciplines cache.
    /// </summary>
    Task UpdateDisciplineAsync(
        Guid id,
        UpdateTechDisciplineRequest request,
        CancellationToken cancellationToken = default);
}
