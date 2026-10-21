using System.Linq.Expressions;
using AndalusiaAcademy.API.DTOs.Catalog;
using AndalusiaAcademy.API.Models.Catalog;

namespace AndalusiaAcademy.API.Mapping.Catalog;

/// <summary>
/// Reusable LINQ projection expressions and mapping logic for the Catalog module.
/// Evaluates server-side on SQL Server to fetch only required columns and subqueries.
/// </summary>
public static class CatalogMappings
{
    /// <summary>
    /// Expression projection from Course entity to CourseSummaryDto.
    /// </summary>
    public static Expression<Func<Course, CourseSummaryDto>> ToCourseSummaryDto(DateTimeOffset now)
    {
        return c => new CourseSummaryDto(
            c.Id,
            c.Title,
            c.Slug,
            c.Description,
            c.ImageUrl,
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

    /// <summary>
    /// Expression projection from Program entity to ProgramSummaryDto.
    /// </summary>
    public static Expression<Func<Models.Catalog.Program, ProgramSummaryDto>> ToProgramSummaryDto(DateTimeOffset now)
    {
        return p => new ProgramSummaryDto(
            p.Id,
            p.Title,
            p.Slug,
            p.Description,
            p.ProgramCategories
                .OrderBy(pc => pc.Sequence)
                .Select(pc => pc.Category.Name)
                .ToList(),
            p.ProgramCourses.Count,
            p.ProgramCourses
                .OrderBy(pc => pc.Sequence)
                .Select(pc => pc.Course.Title)
                .ToList(),
            p.Offerings
                .Where(o => o.Status == "Published" && o.StartsAt > now)
                .OrderBy(o => o.Price)
                .Select(o => (decimal?)o.Price)
                .FirstOrDefault(),
            p.Offerings
                .Where(o => o.Status == "Published" && o.StartsAt > now)
                .OrderBy(o => o.StartsAt)
                .Select(o => (DateTimeOffset?)o.StartsAt)
                .FirstOrDefault()
        );
    }

    /// <summary>
    /// Expression projection from CareerPath entity to CareerPathSummaryDto.
    /// </summary>
    public static Expression<Func<CareerPath, CareerPathSummaryDto>> ToCareerPathSummaryDto()
    {
        return cp => new CareerPathSummaryDto(
            cp.Id,
            cp.Title,
            cp.Slug,
            cp.Description,
            cp.CareerPathPrograms.Count,
            cp.CareerPathCourses.Count,
            cp.CareerPathPrograms
                .SelectMany(cpp => cpp.Program.ProgramCategories.Select(pc => pc.Category.Name))
                .Distinct()
                .ToList()
        );
    }
}
