using AndalusiaAcademy.API.DTOs.Catalog;

namespace AndalusiaAcademy.API.Services.Interfaces.Catalog;

/// <summary>
/// Live (uncached) availability of a published course's open offerings; seat counts change too often to cache.
/// </summary>
public interface IOfferingCatalogService
{
    Task<IReadOnlyList<OpenOfferingDto>> GetOpenOfferingsAsync(string courseSlug, CancellationToken cancellationToken = default);
}
