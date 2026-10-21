using AndalusiaAcademy.API.Models.Identity;

namespace AndalusiaAcademy.API.Services.Interfaces.Identity;

/// <summary>
/// Delivers a password-reset token to the account owner. Implementations enlist in the caller's
/// unit of work (no SaveChanges) so the token and its delivery request commit atomically.
/// </summary>
public interface IPasswordResetNotifier
{
    void Enqueue(AppUser user, string rawToken, DateTimeOffset expiresAt);
}
