namespace AndalusiaAcademy.API.DTOs.Catalog;

/// <summary>
/// Read-optimized, lightweight projection DTO for public course catalog listings.
/// </summary>
public record CourseSummaryDto(
    Guid Id,
    string Title,
    string Slug,
    string Description,
    string? ImageUrl,
    List<string> Categories,
    decimal? StartingPrice,
    DateTimeOffset? NextOfferingDate
);
