using Microsoft.EntityFrameworkCore;
using AndalusiaAcademy.API.Data;
using AndalusiaAcademy.API.DTOs.Catalog;
using AndalusiaAcademy.API.DTOs.Common;
using AndalusiaAcademy.API.Mapping.Catalog;
using AndalusiaAcademy.API.Repositories.Interfaces;

namespace AndalusiaAcademy.API.Repositories.Implementations;

public class ProgramRepository : IProgramRepository
{
    private readonly ApplicationDbContext _context;

    public ProgramRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResult<ProgramSummaryDto>> GetCatalogProgramsAsync(
        CatalogQueryParameters query,
        CancellationToken cancellationToken = default)
    {
        var now = DateTimeOffset.UtcNow;

        var baseQuery = _context.Programs
            .AsNoTracking()
            .Where(p => p.PublicationStatus == "Published");

        if (!string.IsNullOrWhiteSpace(query.SearchTerm))
        {
            var term = query.SearchTerm.Trim();
            baseQuery = baseQuery.Where(p => p.Title.Contains(term) || p.Description.Contains(term));
        }

        if (query.CategoryId.HasValue)
        {
            baseQuery = baseQuery.Where(p => p.ProgramCategories.Any(pc => pc.CategoryId == query.CategoryId.Value));
        }

        var totalCount = await baseQuery.CountAsync(cancellationToken);

        var items = await baseQuery
            .OrderBy(p => p.Title)
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(CatalogMappings.ToProgramSummaryDto(now))
            .ToListAsync(cancellationToken);

        return new PagedResult<ProgramSummaryDto>(items, totalCount, query.PageNumber, query.PageSize);
    }

    public async Task<ProgramDetailDto?> GetProgramDetailAsync(
        string idOrSlug,
        CancellationToken cancellationToken = default)
    {
        var isGuid = Guid.TryParse(idOrSlug, out var id);

        var program = await _context.Programs
            .AsNoTracking()
            .Where(p => isGuid ? p.Id == id : p.Slug == idOrSlug)
            .Include(p => p.ProgramCategories).ThenInclude(pc => pc.Category)
            .Include(p => p.ProgramCourses).ThenInclude(pc => pc.Course)
            .Include(p => p.Offerings)
            .FirstOrDefaultAsync(cancellationToken);

        if (program == null) return null;

        return new ProgramDetailDto(
            program.Id,
            program.Title,
            program.Slug,
            program.Description,
            program.PublicationStatus,
            program.ProgramCategories.OrderBy(pc => pc.Sequence).Select(pc => pc.Category.Name).ToList(),
            program.ProgramCourses
                .OrderBy(pc => pc.Sequence)
                .Select(pc => new ProgramCourseDto(
                    pc.CourseId,
                    pc.Course.Title,
                    pc.Course.Slug,
                    pc.Course.Description,
                    pc.Sequence,
                    pc.IsRequired
                )).ToList(),
            program.Offerings
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
                )).ToList()
        );
    }
}
