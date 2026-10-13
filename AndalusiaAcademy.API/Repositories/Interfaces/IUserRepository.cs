using AndalusiaAcademy.API.Models.Identity;

namespace AndalusiaAcademy.API.Repositories.Interfaces;

public interface IUserRepository
{
    Task<AppUser?> GetByIdWithRolesAsync(Guid id, CancellationToken ct = default);
    Task<AppUser?> GetByEmailWithRolesAsync(string email, CancellationToken ct = default);
    Task<bool> ExistsByEmailAsync(string email, CancellationToken ct = default);
    Task<Role?> GetRoleByNameAsync(string roleName, CancellationToken ct = default);
    Task<AppUser> CreateAsync(AppUser user, CancellationToken ct = default);
}