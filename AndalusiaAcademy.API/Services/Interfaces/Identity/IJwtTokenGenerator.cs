using AndalusiaAcademy.API.Models.Identity;

namespace AndalusiaAcademy.API.Services.Interfaces.Identity;

public interface IJwtTokenGenerator
{
    (string Token, DateTime ExpiresAt) GenerateToken(AppUser user, IEnumerable<string> roles);
}