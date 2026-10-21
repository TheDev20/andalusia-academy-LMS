namespace AndalusiaAcademy.API.DTOs.Catalog;

/// <summary>
/// Query parameters for filtering, searching, and paginating courses in the public catalog.
/// </summary>
public class CatalogQueryParameters
{
    private const int MaxPageSize = 50;
    private int _pageSize = 12;

    /// <summary>
    /// Optional search term matched against course title and description.
    /// </summary>
    public string? SearchTerm { get; set; }

    /// <summary>
    /// Optional category filter identifier.
    /// </summary>
    public Guid? CategoryId { get; set; }

    /// <summary>
    /// 1-based page number (defaults to 1).
    /// </summary>
    public int PageNumber { get; set; } = 1;

    /// <summary>
    /// Number of items per page (defaults to 12, max 50).
    /// </summary>
    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = value > MaxPageSize ? MaxPageSize : (value < 1 ? 1 : value);
    }
}
