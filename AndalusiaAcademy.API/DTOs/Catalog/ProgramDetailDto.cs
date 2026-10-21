namespace AndalusiaAcademy.API.DTOs.Catalog;

/// <summary>
/// Detailed DTO for a specific Program including its full list of included Courses and Offerings.
/// </summary>
public record ProgramDetailDto(
    Guid Id,
    string Title,
    string Slug,
    string Description,
    string PublicationStatus,
    List<string> Categories,
    List<ProgramCourseDto> IncludedCourses,
    List<CatalogOfferingDto> Offerings
);

public record ProgramCourseDto(
    Guid CourseId,
    string Title,
    string Slug,
    string Description,
    int Sequence,
    bool IsRequired
);

public record CatalogOfferingDto(
    Guid Id,
    string Kind,
    DateTimeOffset StartsAt,
    DateTimeOffset EndsAt,
    string TimeZoneId,
    decimal Price,
    string Currency,
    int Capacity,
    string Status
);
