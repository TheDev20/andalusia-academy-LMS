namespace AndalusiaAcademy.API.DTOs.Catalog;

/// <summary>
/// Detailed DTO for a Career Path including linked Programs, Courses, and Career Outcomes.
/// </summary>
public record CareerPathDetailDto(
    Guid Id,
    string Title,
    string Slug,
    string Description,
    List<ProgramSummaryDto> RecommendedPrograms,
    List<CourseSummaryDto> RecommendedCourses
);
