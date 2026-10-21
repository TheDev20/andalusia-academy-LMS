using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using AndalusiaAcademy.API.Data;
using AndalusiaAcademy.API.DTOs.Identity;
using AndalusiaAcademy.API.Exceptions;
using AndalusiaAcademy.API.Models.Identity;
using AndalusiaAcademy.API.Services.Interfaces.Identity;

namespace AndalusiaAcademy.API.Services.Implementations.Identity;

public sealed class ProfileService : IProfileService
{
    private readonly ApplicationDbContext _context;
    private readonly IPasswordHasher<AppUser> _hasher;
    private readonly UserSessionFactory _sessions;

    public ProfileService(ApplicationDbContext context, IPasswordHasher<AppUser> hasher, UserSessionFactory sessions)
    {
        _context = context;
        _hasher = hasher;
        _sessions = sessions;
    }

    public async Task<ProfileDto> GetAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.AppUsers
            .AsNoTracking()
            .Where(u => u.Id == userId)
            .Select(u => new ProfileDto(
                u.Id, u.Email, u.FirstName, u.LastName, u.PhoneNumber, u.CountryCode, u.PreferredLanguage, u.CreatedAt,
                u.UserRoles.Select(ur => ur.Role.Name).OrderBy(n => n).ToList()))
            .FirstOrDefaultAsync(cancellationToken)
            ?? throw new NotFoundException("User not found.");
    }

    public async Task<ProfileDto> UpdateAsync(Guid userId, UpdateProfileRequest request, CancellationToken cancellationToken = default)
    {
        var user = await FindAsync(userId, cancellationToken);

        user.FirstName = request.FirstName.Trim();
        user.LastName = request.LastName.Trim();
        user.PhoneNumber = string.IsNullOrWhiteSpace(request.PhoneNumber) ? null : request.PhoneNumber.Trim();
        user.CountryCode = request.CountryCode.Trim().ToUpperInvariant();
        user.PreferredLanguage = request.PreferredLanguage.Trim();
        await _context.SaveChangesAsync(cancellationToken);

        return await GetAsync(userId, cancellationToken);
    }

    public async Task<AuthResponse> ChangePasswordAsync(Guid userId, ChangePasswordRequest request, CancellationToken cancellationToken = default)
    {
        var user = await FindAsync(userId, cancellationToken);

        if (_hasher.VerifyHashedPassword(user, user.PasswordHash, request.CurrentPassword) == PasswordVerificationResult.Failed)
        {
            throw new BusinessRuleException("The current password is incorrect.");
        }

        user.PasswordHash = _hasher.HashPassword(user, request.NewPassword);
        user.SecurityStamp = AuthService.NewSecurityStamp();
        await _context.SaveChangesAsync(cancellationToken);

        return await _sessions.CreateAsync(user, cancellationToken);
    }

    private async Task<AppUser> FindAsync(Guid userId, CancellationToken cancellationToken) =>
        await _context.AppUsers.FirstOrDefaultAsync(u => u.Id == userId, cancellationToken)
        ?? throw new NotFoundException("User not found.");
}
