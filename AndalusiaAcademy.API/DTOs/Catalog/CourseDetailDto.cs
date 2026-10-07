namespace AndalusiaAcademy.API.DTOs.Catalog;

/// <summary>
/// Detailed DTO for a single Course including categories, offerings, and programs that contain it.
/// </summary>
public record CourseDetailDto(
    Guid Id,
    string Title,
    string Slug,
    string Description,
    string PublicationStatus,
    List<string> Categories,
    List<CatalogOfferingDto> Offerings,
    List<string> IncludedInPrograms
);
