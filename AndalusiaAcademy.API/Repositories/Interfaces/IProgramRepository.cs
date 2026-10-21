using AndalusiaAcademy.API.DTOs.Catalog;
using AndalusiaAcademy.API.DTOs.Common;

namespace AndalusiaAcademy.API.Repositories.Interfaces;

public interface IProgramRepository
{
    /// <summary>
    /// Fetches a paginated list of published academic programs matching search and filter criteria.
    /// </summary>
    Task<PagedResult<ProgramSummaryDto>> GetCatalogProgramsAsync(
        CatalogQueryParameters query,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Fetches detailed program information including all included courses and scheduled offerings.
    /// </summary>
    Task<ProgramDetailDto?> GetProgramDetailAsync(
        string idOrSlug,
        CancellationToken cancellationToken = default);
}
