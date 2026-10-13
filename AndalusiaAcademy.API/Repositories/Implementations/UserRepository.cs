using Microsoft.EntityFrameworkCore;
using AndalusiaAcademy.API.Data;
using AndalusiaAcademy.API.Models.Identity;
using AndalusiaAcademy.API.Repositories.Interfaces;

namespace AndalusiaAcademy.API.Repositories.Implementations;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<AppUser?> GetByIdWithRolesAsync(Guid id, CancellationToken ct = default)
    {
        return await _context.AppUsers
            .AsNoTracking()
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Id == id, ct);
    }

    public async Task<AppUser?> GetByEmailWithRolesAsync(string email, CancellationToken ct = default)
    {
        var normalized = email.Trim().ToLowerInvariant();
        return await _context.AppUsers
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Email == normalized, ct);
    }

    public async Task<bool> ExistsByEmailAsync(string email, CancellationToken ct = default)
    {
        var normalized = email.Trim().ToLowerInvariant();
        return await _context.AppUsers
            .AnyAsync(u => u.Email == normalized, ct);
    }

    public async Task<Role?> GetRoleByNameAsync(string roleName, CancellationToken ct = default)
    {
        return await _context.Roles
            .FirstOrDefaultAsync(r => r.Name == roleName, ct);
    }

    public async Task<AppUser> CreateAsync(AppUser user, CancellationToken ct = default)
    {
        await _context.AppUsers.AddAsync(user, ct);
        await _context.SaveChangesAsync(ct);
        return user;
    }
}