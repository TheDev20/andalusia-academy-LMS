namespace AndalusiaAcademy.API.DTOs.Catalog;

/// <summary>
/// DTO representing each card in the Explore Programs by Tech Discipline section.
/// </summary>
public record TechDisciplineDto(
    Guid Id,
    string Title,
    string Slug,
    string Description,
    string Icon,
    int ProgramsCount,
    string CountDisplay
);

/// <summary>
/// DTO sent from Swagger when an Admin creates a new Tech Discipline.
/// </summary>
public class CreateTechDisciplineRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Icon { get; set; } = "Code2";
}

/// <summary>
/// DTO sent from Swagger when an Admin updates an existing Tech Discipline.
/// </summary>
public class UpdateTechDisciplineRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Icon { get; set; } = "Code2";
}