using System.Linq.Expressions;
using AndalusiaAcademy.API.DTOs.Catalog;
using AndalusiaAcademy.API.Models.Catalog;

namespace AndalusiaAcademy.API.Mapping.Catalog;

/// <summary>
/// Reusable LINQ projection expressions and mapping logic for the Catalog module.
/// </summary>
public static class CatalogMappings
{
    /// <summary>
    /// Expression projection from Course entity to CourseSummaryDto.
    /// Evaluates server-side on SQL Server to fetch only required columns and subqueries.
    /// </summary>
    public static Expression<Func<Course, CourseSummaryDto>> ToCourseSummaryDto(DateTimeOffset now)
    {
        return c => new CourseSummaryDto(
            c.Id,
            c.Title,
            c.Slug,
            c.Description,
            c.CourseCategories
                .OrderBy(cc => cc.Sequence)
                .Select(cc => cc.Category.Name)
                .ToList(),
            c.Offerings
                .Where(o => o.Status == "Published" && o.StartsAt > now)
                .OrderBy(o => o.Price)
                .Select(o => (decimal?)o.Price)
                .FirstOrDefault(),
            c.Offerings
                .Where(o => o.Status == "Published" && o.StartsAt > now)
                .OrderBy(o => o.StartsAt)
                .Select(o => (DateTimeOffset?)o.StartsAt)
                .FirstOrDefault()
        );
    }
}
