namespace AndalusiaAcademy.API.DTOs.Catalog;

/// <summary>
/// Read-optimized, lightweight projection DTO for public course catalog listings.
/// Bypasses full entity tracking and returns only the fields needed for discovery cards.
/// </summary>
public record CourseSummaryDto(
    Guid Id,
    string Title,
    string Slug,
    string Description,
    List<string> Categories,
    decimal? StartingPrice,
    DateTimeOffset? NextOfferingDate
);
