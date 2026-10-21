using System.Security.Cryptography;
using Microsoft.AspNetCore.Identity;
using AndalusiaAcademy.API.Models.Identity;

namespace AndalusiaAcademy.API.Services.Implementations.Identity;

/// <summary>
/// ASP.NET Core Identity hashing, plus verification of the legacy "base64(salt).base64(key)" PBKDF2-SHA256
/// format written by the earlier Full-Stack-Academy auth implementation. Legacy matches return
/// <see cref="PasswordVerificationResult.SuccessRehashNeeded"/>, so the login flow upgrades the stored hash.
/// </summary>
public sealed class CompatiblePasswordHasher : IPasswordHasher<AppUser>
{
    private const int LegacyIterations = 100_000;
    private const int LegacyKeySize = 32;

    private readonly PasswordHasher<AppUser> _inner = new();

    public string HashPassword(AppUser user, string password) => _inner.HashPassword(user, password);

    public PasswordVerificationResult VerifyHashedPassword(AppUser user, string hashedPassword, string providedPassword)
    {
        if (TryParseLegacy(hashedPassword, out var salt, out var key))
        {
            var candidate = Rfc2898DeriveBytes.Pbkdf2(providedPassword, salt, LegacyIterations, HashAlgorithmName.SHA256, LegacyKeySize);
            return CryptographicOperations.FixedTimeEquals(candidate, key)
                ? PasswordVerificationResult.SuccessRehashNeeded
                : PasswordVerificationResult.Failed;
        }

        try
        {
            return _inner.VerifyHashedPassword(user, hashedPassword, providedPassword);
        }
        catch (FormatException)
        {
            // Corrupt or unknown hash formats must fail authentication, not surface as a server error.
            return PasswordVerificationResult.Failed;
        }
    }

    private static bool TryParseLegacy(string hashedPassword, out byte[] salt, out byte[] key)
    {
        salt = key = [];
        var parts = hashedPassword.Split('.');
        if (parts.Length != 2)
        {
            return false;
        }

        try
        {
            salt = Convert.FromBase64String(parts[0]);
            key = Convert.FromBase64String(parts[1]);
            return salt.Length > 0 && key.Length == LegacyKeySize;
        }
        catch (FormatException)
        {
            return false;
        }
    }
}
