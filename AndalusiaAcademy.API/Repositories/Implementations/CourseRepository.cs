using Microsoft.EntityFrameworkCore;
using AndalusiaAcademy.API.Data;
using AndalusiaAcademy.API.DTOs.Catalog;
using AndalusiaAcademy.API.DTOs.Common;
using AndalusiaAcademy.API.Mapping.Catalog;
using AndalusiaAcademy.API.Repositories.Interfaces;

namespace AndalusiaAcademy.API.Repositories.Implementations;

public class CourseRepository : ICourseRepository
{
    private readonly ApplicationDbContext _context;

    public CourseRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResult<CourseSummaryDto>> GetCatalogCoursesAsync(
        CatalogQueryParameters query,
        CancellationToken cancellationToken = default)
    {
        var now = DateTimeOffset.UtcNow;

        var baseQuery = _context.Courses
            .AsNoTracking()
            .Where(c => c.PublicationStatus == "Published");

        if (!string.IsNullOrWhiteSpace(query.SearchTerm))
        {
            var term = query.SearchTerm.Trim();
            baseQuery = baseQuery.Where(c => c.Title.Contains(term) || c.Description.Contains(term));
        }

        if (query.CategoryId.HasValue)
        {
            baseQuery = baseQuery.Where(c => c.CourseCategories.Any(cc => cc.CategoryId == query.CategoryId.Value));
        }

        var totalCount = await baseQuery.CountAsync(cancellationToken);

        var items = await baseQuery
            .OrderBy(c => c.Title)
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(CatalogMappings.ToCourseSummaryDto(now))
            .ToListAsync(cancellationToken);

        return new PagedResult<CourseSummaryDto>(items, totalCount, query.PageNumber, query.PageSize);
    }
}
