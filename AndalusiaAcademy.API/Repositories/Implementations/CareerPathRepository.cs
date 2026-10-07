using Microsoft.EntityFrameworkCore;
using AndalusiaAcademy.API.Data;
using AndalusiaAcademy.API.DTOs.Catalog;
using AndalusiaAcademy.API.Mapping.Catalog;
using AndalusiaAcademy.API.Repositories.Interfaces;

namespace AndalusiaAcademy.API.Repositories.Implementations;

public class CareerPathRepository : ICareerPathRepository
{
    private readonly ApplicationDbContext _context;

    public CareerPathRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<CareerPathSummaryDto>> GetCareerPathsAsync(
        CancellationToken cancellationToken = default)
    {
        return await _context.CareerPaths
            .AsNoTracking()
            .OrderBy(cp => cp.Title)
            .Select(CatalogMappings.ToCareerPathSummaryDto())
            .ToListAsync(cancellationToken);
    }

    public async Task<CareerPathDetailDto?> GetCareerPathDetailAsync(
        string idOrSlug,
        CancellationToken cancellationToken = default)
    {
        var now = DateTimeOffset.UtcNow;
        var isGuid = Guid.TryParse(idOrSlug, out var id);

        var careerPath = await _context.CareerPaths
            .AsNoTracking()
            .Where(cp => isGuid ? cp.Id == id : cp.Slug == idOrSlug)
            .Include(cp => cp.CareerPathPrograms).ThenInclude(cpp => cpp.Program).ThenInclude(p => p.ProgramCategories).ThenInclude(pc => pc.Category)
            .Include(cp => cp.CareerPathPrograms).ThenInclude(cpp => cpp.Program).ThenInclude(p => p.ProgramCourses).ThenInclude(pc => pc.Course)
            .Include(cp => cp.CareerPathPrograms).ThenInclude(cpp => cpp.Program).ThenInclude(p => p.Offerings)
            .Include(cp => cp.CareerPathCourses).ThenInclude(cpc => cpc.Course).ThenInclude(c => c.CourseCategories).ThenInclude(cc => cc.Category)
            .Include(cp => cp.CareerPathCourses).ThenInclude(cpc => cpc.Course).ThenInclude(c => c.Offerings)
            .FirstOrDefaultAsync(cancellationToken);

        if (careerPath == null) return null;

        var programs = careerPath.CareerPathPrograms
            .OrderBy(cpp => cpp.Sequence)
            .Select(cpp => new ProgramSummaryDto(
                cpp.Program.Id,
                cpp.Program.Title,
                cpp.Program.Slug,
                cpp.Program.Description,
                cpp.Program.ProgramCategories.OrderBy(pc => pc.Sequence).Select(pc => pc.Category.Name).ToList(),
                cpp.Program.ProgramCourses.Count,
                cpp.Program.ProgramCourses.OrderBy(pc => pc.Sequence).Select(pc => pc.Course.Title).ToList(),
                cpp.Program.Offerings.Where(o => o.Status == "Published" && o.StartsAt > now).OrderBy(o => o.Price).Select(o => (decimal?)o.Price).FirstOrDefault(),
                cpp.Program.Offerings.Where(o => o.Status == "Published" && o.StartsAt > now).OrderBy(o => o.StartsAt).Select(o => (DateTimeOffset?)o.StartsAt).FirstOrDefault()
            ))
            .ToList();

        var courses = careerPath.CareerPathCourses
            .OrderBy(cpc => cpc.Sequence)
            .Select(cpc => new CourseSummaryDto(
                cpc.Course.Id,
                cpc.Course.Title,
                cpc.Course.Slug,
                cpc.Course.Description,
                cpc.Course.CourseCategories.OrderBy(cc => cc.Sequence).Select(cc => cc.Category.Name).ToList(),
                cpc.Course.Offerings.Where(o => o.Status == "Published" && o.StartsAt > now).OrderBy(o => o.Price).Select(o => (decimal?)o.Price).FirstOrDefault(),
                cpc.Course.Offerings.Where(o => o.Status == "Published" && o.StartsAt > now).OrderBy(o => o.StartsAt).Select(o => (DateTimeOffset?)o.StartsAt).FirstOrDefault()
            ))
            .ToList();

        return new CareerPathDetailDto(
            careerPath.Id,
            careerPath.Title,
            careerPath.Slug,
            careerPath.Description,
            programs,
            courses
        );
    }
}
