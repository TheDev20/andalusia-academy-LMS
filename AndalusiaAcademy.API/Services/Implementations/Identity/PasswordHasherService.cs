using System.Security.Cryptography;
using AndalusiaAcademy.API.Services.Interfaces.Identity;

namespace AndalusiaAcademy.API.Services.Implementations.Identity;

public class PasswordHasherService : IPasswordHasherService
{
    private const int SaltSize = 16;
    private const int KeySize = 32;
    private const int Iterations = 100000;
    private static readonly HashAlgorithmName Algorithm = HashAlgorithmName.SHA256;

    public string HashPassword(string password)
    {
        byte[] salt = RandomNumberGenerator.GetBytes(SaltSize);
        byte[] key = Rfc2898DeriveBytes.Pbkdf2(password, salt, Iterations, Algorithm, KeySize);
        return $"{Convert.ToBase64String(salt)}.{Convert.ToBase64String(key)}";
    }

    public bool VerifyPassword(string password, string passwordHash)
    {
        var parts = passwordHash.Split('.');
        if (parts.Length != 2) return false;

        byte[] salt = Convert.FromBase64String(parts[0]);
        byte[] key = Convert.FromBase64String(parts[1]);

        byte[] incomingKey = Rfc2898DeriveBytes.Pbkdf2(password, salt, Iterations, Algorithm, KeySize);
        return CryptographicOperations.FixedTimeEquals(key, incomingKey);
    }
}