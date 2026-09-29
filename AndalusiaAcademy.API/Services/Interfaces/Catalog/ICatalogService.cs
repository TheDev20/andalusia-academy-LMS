using AndalusiaAcademy.API.Common;
using AndalusiaAcademy.API.DTOs.Catalog;

namespace AndalusiaAcademy.API.Services.Interfaces.Catalog;

public interface ICatalogService
{
    Task<PagedResult<CourseSummaryDto>> GetCoursesAsync(
        CatalogQueryParameters query,
        CancellationToken cancellationToken = default);
}
