using AndalusiaAcademy.API.DTOs.Catalog;
using AndalusiaAcademy.API.Models.Catalog;

namespace AndalusiaAcademy.API.Repositories.Interfaces;

public interface ICategoryRepository
{
    Task<List<TechDisciplineDto>> GetDisciplinesAsync(CancellationToken ct = default);
    Task<Category?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<bool> ExistsByNameAsync(string name, CancellationToken ct = default);
    Task<Category> CreateAsync(Category category, CancellationToken ct = default);
    Task UpdateAsync(Category category, CancellationToken ct = default);
}
