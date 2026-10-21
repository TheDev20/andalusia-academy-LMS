namespace AndalusiaAcademy.API.DTOs.Catalog;

/// <summary>
/// Lightweight projection DTO for public program catalog listings.
/// </summary>
public record ProgramSummaryDto(
    Guid Id,
    string Title,
    string Slug,
    string Description,
    List<string> Categories,
    int CoursesCount,
    List<string> CourseTitles,
    decimal? StartingPrice,
    DateTimeOffset? NextOfferingDate
);
