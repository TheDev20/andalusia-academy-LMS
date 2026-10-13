using Microsoft.EntityFrameworkCore;
using AndalusiaAcademy.API.Data;
using AndalusiaAcademy.API.DTOs.Catalog;
using AndalusiaAcademy.API.Models.Catalog;
using AndalusiaAcademy.API.Repositories.Interfaces;

namespace AndalusiaAcademy.API.Repositories.Implementations;

public class CategoryRepository : ICategoryRepository
{
    private readonly ApplicationDbContext _context;

    public CategoryRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<TechDisciplineDto>> GetDisciplinesAsync(CancellationToken ct = default)
    {
        // Level 5:.AsNoTracking() + Direct DTO Projection (.Select())
        return await _context.Categories
            .AsNoTracking()
            .OrderBy(c => c.Name)
            .Select(c => new TechDisciplineDto(
                c.Id,
                c.Name,
                c.Slug,
                c.Description,
                c.Icon,
                c.ProgramCategories.Count,
                $"{c.ProgramCategories.Count} Programs"
            ))
            .ToListAsync(ct);
    }

    public async Task<Category?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await _context.Categories.FirstOrDefaultAsync(c => c.Id == id, ct);
    }

    public async Task<bool> ExistsByNameAsync(string name, CancellationToken ct = default)
    {
        var normalized = name.Trim().ToLower();
        return await _context.Categories
            .AnyAsync(c => c.Name.ToLower() == normalized, ct);
    }

    public async Task<Category> CreateAsync(Category category, CancellationToken ct = default)
    {
        await _context.Categories.AddAsync(category, ct);
        await _context.SaveChangesAsync(ct);
        return category;
    }

    public async Task UpdateAsync(Category category, CancellationToken ct = default)
    {
        _context.Categories.Update(category);
        await _context.SaveChangesAsync(ct);
    }
}
