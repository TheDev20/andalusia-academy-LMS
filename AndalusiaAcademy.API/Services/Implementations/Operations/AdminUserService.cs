using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using AndalusiaAcademy.API.Common.Security;
using AndalusiaAcademy.API.Data;
using AndalusiaAcademy.API.Data.Seed;
using AndalusiaAcademy.API.DTOs.Common;
using AndalusiaAcademy.API.DTOs.Operations;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.API.Exceptions;
using AndalusiaAcademy.API.Models.Identity;
using AndalusiaAcademy.API.Services.Implementations.Identity;
using AndalusiaAcademy.API.Services.Interfaces.Operations;

namespace AndalusiaAcademy.API.Services.Implementations.Operations;

public sealed class AdminUserService : IAdminUserService
{
    private readonly ApplicationDbContext _context;
    private readonly IPasswordHasher<AppUser> _hasher;
    private readonly ICurrentUser _currentUser;
    private readonly TimeProvider _clock;
    private readonly ILogger<AdminUserService> _logger;

    public AdminUserService(
        ApplicationDbContext context,
        IPasswordHasher<AppUser> hasher,
        ICurrentUser currentUser,
        TimeProvider clock,
        ILogger<AdminUserService> logger)
    {
        _context = context;
        _hasher = hasher;
        _currentUser = currentUser;
        _clock = clock;
        _logger = logger;
    }

    public async Task<PagedResult<AdminUserDto>> ListAsync(AdminUserQuery query, CancellationToken cancellationToken = default)
    {
        var users = _context.AppUsers.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(query.Role))
        {
            users = users.Where(u => u.UserRoles.Any(ur => ur.Role.Name == query.Role));
        }

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var term = query.Search.Trim();
            users = users.Where(u => u.Email.Contains(term) || u.FirstName.Contains(term) || u.LastName.Contains(term));
        }

        var total = await users.CountAsync(cancellationToken);
        var items = await users
            .OrderBy(u => u.LastName).ThenBy(u => u.FirstName).ThenBy(u => u.Id)
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(ToDto)
            .ToListAsync(cancellationToken);

        return new PagedResult<AdminUserDto>(items, total, query.PageNumber, query.PageSize);
    }

    public async Task<AdminUserDto> GetAsync(Guid userId, CancellationToken cancellationToken = default) =>
        await _context.AppUsers.AsNoTracking().Where(u => u.Id == userId).Select(ToDto).FirstOrDefaultAsync(cancellationToken)
        ?? throw new NotFoundException("User not found.");

    public async Task<AdminUserDto> CreateInstructorAsync(CreateInstructorRequest request, CancellationToken cancellationToken = default)
    {
        var email = AuthService.NormalizeEmail(request.Email);
        if (await _context.AppUsers.AnyAsync(u => u.Email == email, cancellationToken))
        {
            throw new ConflictException("An account with this e-mail already exists.");
        }

        var user = new AppUser
        {
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Email = email,
            CreatedAt = _clock.GetUtcNow()
        };
        user.PasswordHash = _hasher.HashPassword(user, request.TemporaryPassword);
        user.UserRoles.Add(new UserRole { UserId = user.Id, RoleId = IdentitySeedData.RoleIdFor(AppRoles.Instructor) });
        user.InstructorProfile = new InstructorProfile { UserId = user.Id, Biography = request.Biography?.Trim() ?? string.Empty };

        _context.AppUsers.Add(user);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Admin {AdminId} created instructor {UserId}", _currentUser.UserId, user.Id);
        return await GetAsync(user.Id, cancellationToken);
    }

    public async Task<AdminUserDto> SetStatusAsync(Guid userId, SetUserStatusRequest request, CancellationToken cancellationToken = default)
    {
        if (userId == _currentUser.UserId && !request.IsActive)
        {
            throw new BusinessRuleException("You cannot deactivate your own account.");
        }

        var user = await FindAsync(userId, cancellationToken);
        if (user.IsActive != request.IsActive)
        {
            user.IsActive = request.IsActive;
            // Deactivation revokes outstanding tokens immediately.
            user.SecurityStamp = AuthService.NewSecurityStamp();
            await _context.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Admin {AdminId} set user {UserId} active={IsActive}", _currentUser.UserId, userId, request.IsActive);
        }

        return await GetAsync(userId, cancellationToken);
    }

    public async Task<AdminUserDto> SetRolesAsync(Guid userId, SetUserRolesRequest request, CancellationToken cancellationToken = default)
    {
        var requested = request.Roles.Distinct(StringComparer.Ordinal).ToList();
        var invalid = requested.Except(AppRoles.All).ToList();
        if (invalid.Count > 0)
        {
            throw new BusinessRuleException($"Unknown role(s): {string.Join(", ", invalid)}.");
        }

        if (userId == _currentUser.UserId && !requested.Contains(AppRoles.Admin))
        {
            throw new BusinessRuleException("You cannot remove your own Admin role.");
        }

        var user = await _context.AppUsers
            .Include(u => u.UserRoles)
            .Include(u => u.InstructorProfile)
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken)
            ?? throw new NotFoundException("User not found.");

        var targetRoleIds = requested.Select(IdentitySeedData.RoleIdFor).ToHashSet();
        foreach (var stale in user.UserRoles.Where(ur => !targetRoleIds.Contains(ur.RoleId)).ToList())
        {
            user.UserRoles.Remove(stale);
        }

        foreach (var roleId in targetRoleIds.Where(id => user.UserRoles.All(ur => ur.RoleId != id)))
        {
            user.UserRoles.Add(new UserRole { UserId = user.Id, RoleId = roleId });
        }

        if (requested.Contains(AppRoles.Instructor) && user.InstructorProfile is null)
        {
            user.InstructorProfile = new InstructorProfile { UserId = user.Id };
        }

        // Permissions are embedded in tokens; force re-login so the new grants apply.
        user.SecurityStamp = AuthService.NewSecurityStamp();
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Admin {AdminId} set roles of user {UserId} to {Roles}", _currentUser.UserId, userId, string.Join(",", requested));
        return await GetAsync(userId, cancellationToken);
    }

    private async Task<AppUser> FindAsync(Guid userId, CancellationToken cancellationToken) =>
        await _context.AppUsers.FirstOrDefaultAsync(u => u.Id == userId, cancellationToken)
        ?? throw new NotFoundException("User not found.");

    private static readonly System.Linq.Expressions.Expression<Func<AppUser, AdminUserDto>> ToDto =
        u => new AdminUserDto(
            u.Id, u.Email, u.FirstName, u.LastName, u.PhoneNumber, u.IsActive, u.CreatedAt,
            u.UserRoles.Select(ur => ur.Role.Name).OrderBy(n => n).ToList());
}
