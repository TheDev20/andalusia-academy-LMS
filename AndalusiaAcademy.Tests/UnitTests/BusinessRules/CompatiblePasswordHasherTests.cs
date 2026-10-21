using System.Security.Cryptography;
using Microsoft.AspNetCore.Identity;
using AndalusiaAcademy.API.Models.Identity;
using AndalusiaAcademy.API.Services.Implementations.Identity;

namespace AndalusiaAcademy.Tests.UnitTests.BusinessRules;

public class CompatiblePasswordHasherTests
{
    private readonly CompatiblePasswordHasher _hasher = new();
    private readonly AppUser _user = new();

    private static string LegacyHash(string password)
    {
        var salt = RandomNumberGenerator.GetBytes(16);
        var key = Rfc2898DeriveBytes.Pbkdf2(password, salt, 100_000, HashAlgorithmName.SHA256, 32);
        return $"{Convert.ToBase64String(salt)}.{Convert.ToBase64String(key)}";
    }

    [Fact]
    public void Current_hashes_round_trip()
    {
        var hash = _hasher.HashPassword(_user, "Secret#123");

        Assert.Equal(PasswordVerificationResult.Success, _hasher.VerifyHashedPassword(_user, hash, "Secret#123"));
        Assert.Equal(PasswordVerificationResult.Failed, _hasher.VerifyHashedPassword(_user, hash, "wrong"));
    }

    [Fact]
    public void Legacy_hashes_verify_and_request_a_rehash()
    {
        var legacy = LegacyHash("Secret#123");

        Assert.Equal(PasswordVerificationResult.SuccessRehashNeeded, _hasher.VerifyHashedPassword(_user, legacy, "Secret#123"));
        Assert.Equal(PasswordVerificationResult.Failed, _hasher.VerifyHashedPassword(_user, legacy, "wrong"));
    }

    [Theory]
    [InlineData("not a hash")]
    [InlineData("")]
    [InlineData("abc.def.ghi")]
    public void Malformed_hashes_fail_instead_of_throwing(string stored)
    {
        Assert.Equal(PasswordVerificationResult.Failed, _hasher.VerifyHashedPassword(_user, stored, "anything"));
    }
}
