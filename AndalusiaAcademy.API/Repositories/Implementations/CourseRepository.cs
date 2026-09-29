using Microsoft.EntityFrameworkCore;
using AndalusiaAcademy.API.Common;
using AndalusiaAcademy.API.Data;
using AndalusiaAcademy.API.DTOs.Catalog;
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

        // 1. AsNoTracking avoids change-tracking overhead for high-throughput reads
        var baseQuery = _context.Courses
            .AsNoTracking()
            .Where(c => c.PublicationStatus == "Published");

        // 2. Search term matching across Title and Description
        if (!string.IsNullOrWhiteSpace(query.SearchTerm))
        {
            var term = query.SearchTerm.Trim();
            baseQuery = baseQuery.Where(c => c.Title.Contains(term) || c.Description.Contains(term));
        }

        // 3. Category filtering via many-to-many join
        if (query.CategoryId.HasValue)
        {
            baseQuery = baseQuery.Where(c => c.CourseCategories.Any(cc => cc.CategoryId == query.CategoryId.Value));
        }

        // 4. Total count evaluated on SQL Server
        var totalCount = await baseQuery.CountAsync(cancellationToken);

        // 5. Direct projection into CourseSummaryDto with pagination
        var items = await baseQuery
            .OrderBy(c => c.Title)
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(c => new CourseSummaryDto(
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
            ))
            .ToListAsync(cancellationToken);

        return new PagedResult<CourseSummaryDto>(items, totalCount, query.PageNumber, query.PageSize);
    }
}
