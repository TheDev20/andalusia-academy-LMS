namespace AndalusiaAcademy.API.DTOs.Catalog;

/// <summary>
/// Projection DTO for public Career Path listings.
/// </summary>
public record CareerPathSummaryDto(
    Guid Id,
    string Title,
    string Slug,
    string Description,
    int ProgramsCount,
    int CoursesCount,
    List<string> RecommendedSkillTags
);
