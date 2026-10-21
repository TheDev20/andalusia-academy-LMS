using AndalusiaAcademy.API.DTOs.Catalog;

namespace AndalusiaAcademy.API.Repositories.Interfaces;

public interface ICareerPathRepository
{
    /// <summary>
    /// Fetches all active career paths with program and course counts.
    /// </summary>
    Task<List<CareerPathSummaryDto>> GetCareerPathsAsync(
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Fetches a specific career path with all its recommended programs and courses.
    /// </summary>
    Task<CareerPathDetailDto?> GetCareerPathDetailAsync(
        string idOrSlug,
        CancellationToken cancellationToken = default);
}
