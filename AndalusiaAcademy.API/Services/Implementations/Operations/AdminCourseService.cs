using Microsoft.EntityFrameworkCore;
using AndalusiaAcademy.API.Data;
using AndalusiaAcademy.API.DTOs.Common;
using AndalusiaAcademy.API.DTOs.Operations;
using AndalusiaAcademy.API.Exceptions;
using AndalusiaAcademy.API.Models.Catalog;
using AndalusiaAcademy.API.Services.Implementations.Catalog;
using AndalusiaAcademy.API.Services.Interfaces.Operations;

namespace AndalusiaAcademy.API.Services.Implementations.Operations;

/// <summary>
/// Course management. Every write evicts the public catalog cache so the website reflects it immediately.
/// </summary>
public sealed class AdminCourseService : IAdminCourseService
{
    private readonly ApplicationDbContext _context;
    private readonly CatalogCacheInvalidator _catalogCache;

    public AdminCourseService(ApplicationDbContext context, CatalogCacheInvalidator catalogCache)
    {
        _context = context;
        _catalogCache = catalogCache;
    }

    public async Task<PagedResult<AdminCourseDto>> ListAsync(AdminListQuery query, CancellationToken cancellationToken = default)
    {
        var courses = _context.Courses.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var term = query.Search.Trim();
            courses = courses.Where(c => c.Title.Contains(term) || c.Slug.Contains(term));
        }

        var total = await courses.CountAsync(cancellationToken);
        var items = await courses
            .OrderBy(c => c.Title).ThenBy(c => c.Id)
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(ToDto)
            .ToListAsync(cancellationToken);

        return new PagedResult<AdminCourseDto>(items, total, query.PageNumber, query.PageSize);
    }

    public async Task<AdminCourseDto> GetAsync(Guid courseId, CancellationToken cancellationToken = default) =>
        await _context.Courses.AsNoTracking().Where(c => c.Id == courseId).Select(ToDto).FirstOrDefaultAsync(cancellationToken)
        ?? throw new NotFoundException("Course not found.");

    public async Task<AdminCourseDto> CreateAsync(UpsertCourseRequest request, CancellationToken cancellationToken = default)
    {
        await EnsureSlugAvailableAsync(request.Slug, null, cancellationToken);

        var course = new Course();
        Apply(course, request);
        if (request.CategoryId.HasValue)
        {
            course.CourseCategories.Add(new CourseCategory
            {
                CourseId = course.Id,
                CategoryId = request.CategoryId.Value,
                Sequence = 1
            });
        }
        _context.Courses.Add(course);
        await _context.SaveChangesAsync(cancellationToken);
        _catalogCache.Invalidate();

        return await GetAsync(course.Id, cancellationToken);
    }

    public async Task<AdminCourseDto> UpdateAsync(Guid courseId, UpsertCourseRequest request, CancellationToken cancellationToken = default)
    {
        var course = await _context.Courses
            .Include(c => c.CourseCategories)
            .FirstOrDefaultAsync(c => c.Id == courseId, cancellationToken)
            ?? throw new NotFoundException("Course not found.");
        await EnsureSlugAvailableAsync(request.Slug, courseId, cancellationToken);

        Apply(course, request);

        if (request.CategoryId.HasValue)
        {
            var existing = course.CourseCategories.FirstOrDefault();
            if (existing == null)
            {
                course.CourseCategories.Add(new CourseCategory
                {
                    CourseId = course.Id,
                    CategoryId = request.CategoryId.Value,
                    Sequence = 1
                });
            }
            else if (existing.CategoryId != request.CategoryId.Value)
            {
                _context.CourseCategories.Remove(existing);
                course.CourseCategories.Add(new CourseCategory
                {
                    CourseId = course.Id,
                    CategoryId = request.CategoryId.Value,
                    Sequence = 1
                });
            }
        }
        else
        {
            _context.CourseCategories.RemoveRange(course.CourseCategories);
        }

        await _context.SaveChangesAsync(cancellationToken);
        _catalogCache.Invalidate();

        return await GetAsync(courseId, cancellationToken);
    }

    public async Task DeleteAsync(Guid courseId, CancellationToken cancellationToken = default)
    {
        var course = await _context.Courses.FirstOrDefaultAsync(c => c.Id == courseId, cancellationToken)
            ?? throw new NotFoundException("Course not found.");

        var inUse = await _context.Offerings.AnyAsync(o => o.CourseId == courseId, cancellationToken)
            || await _context.ProgramCourses.AnyAsync(pc => pc.CourseId == courseId, cancellationToken)
            || await _context.CareerPathCourses.AnyAsync(cp => cp.CourseId == courseId, cancellationToken);
        if (inUse)
        {
            throw new ConflictException("This course has offerings or catalog links; archive it instead of deleting.");
        }

        _context.CourseCategories.RemoveRange(
            await _context.CourseCategories.Where(cc => cc.CourseId == courseId).ToListAsync(cancellationToken));
        _context.Courses.Remove(course);
        await _context.SaveChangesAsync(cancellationToken);
        _catalogCache.Invalidate();
    }

    private async Task EnsureSlugAvailableAsync(string slug, Guid? excludeId, CancellationToken cancellationToken)
    {
        if (await _context.Courses.AnyAsync(c => c.Slug == slug && c.Id != excludeId, cancellationToken))
        {
            throw new ConflictException("Another course already uses this slug.");
        }
    }

    private static void Apply(Course course, UpsertCourseRequest request)
    {
        course.Title = request.Title.Trim();
        course.Slug = request.Slug.Trim();
        course.Description = request.Description.Trim();
        course.PublicationStatus = request.PublicationStatus;
        course.ImageUrl = string.IsNullOrWhiteSpace(request.ImageUrl) ? null : request.ImageUrl.Trim();
    }

    private static readonly System.Linq.Expressions.Expression<Func<Course, AdminCourseDto>> ToDto =
        c => new AdminCourseDto(
            c.Id,
            c.Title,
            c.Slug,
            c.Description,
            c.PublicationStatus,
            c.Offerings.Count,
            c.CourseCategories.Select(cc => (Guid?)cc.CategoryId).FirstOrDefault(),
            c.CourseCategories.Select(cc => cc.Category.Name).FirstOrDefault(),
            c.ImageUrl);
}
