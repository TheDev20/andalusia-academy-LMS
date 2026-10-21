using Microsoft.EntityFrameworkCore;
using AndalusiaAcademy.API.Common.Security;
using AndalusiaAcademy.API.Data;
using AndalusiaAcademy.API.DTOs.Identity;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.API.Models.Identity;

namespace AndalusiaAcademy.API.Services.Implementations.Identity;

/// <summary>
/// Builds the authenticated session payload (token + user summary) for a persisted user.
/// </summary>
public sealed class UserSessionFactory
{
    private readonly ApplicationDbContext _context;
    private readonly ITokenService _tokens;

    public UserSessionFactory(ApplicationDbContext context, ITokenService tokens)
    {
        _context = context;
        _tokens = tokens;
    }

    public async Task<AuthResponse> CreateAsync(AppUser user, CancellationToken cancellationToken)
    {
        var roles = await _context.UserRoles
            .AsNoTracking()
            .Where(ur => ur.UserId == user.Id)
            .Select(ur => ur.Role.Name)
            .OrderBy(n => n)
            .ToListAsync(cancellationToken);

        var token = _tokens.CreateAccessToken(user, roles);
        var summary = new UserSummaryDto(
            user.Id, user.Email, user.FirstName, user.LastName,
            roles, RolePermissionMatrix.PermissionsFor(roles));

        return new AuthResponse(token.Token, "Bearer", token.ExpiresAt, summary);
    }
}
