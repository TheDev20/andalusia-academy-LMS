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

    public async Task<CourseDetailDto?> GetCourseDetailAsync(
        string idOrSlug,
        CancellationToken cancellationToken = default)
    {
        var now = DateTimeOffset.UtcNow;
        var isGuid = Guid.TryParse(idOrSlug, out var id);

        var query = _context.Courses
            .AsNoTracking()
            .Where(c => isGuid ? c.Id == id : c.Slug == idOrSlug);

        var course = await query
            .Include(c => c.CourseCategories).ThenInclude(cc => cc.Category)
            .Include(c => c.Offerings)
            .Include(c => c.ProgramCourses).ThenInclude(pc => pc.Program)
            .FirstOrDefaultAsync(cancellationToken);

        if (course == null) return null;

        return new CourseDetailDto(
            course.Id,
            course.Title,
            course.Slug,
            course.Description,
            course.PublicationStatus,
            course.CourseCategories.OrderBy(cc => cc.Sequence).Select(cc => cc.Category.Name).ToList(),
            course.Offerings
                .Where(o => o.Status == "Published")
                .OrderBy(o => o.StartsAt)
                .Select(o => new CatalogOfferingDto(
                    o.Id,
                    o.Kind,
                    o.StartsAt,
                    o.EndsAt,
                    o.TimeZoneId,
                    o.Price,
                    o.Currency,
                    o.Capacity,
                    o.Status
                )).ToList(),
            course.ProgramCourses.Select(pc => pc.Program.Title).ToList()
        );
    }
}
