using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.API.Models.Identity;

namespace AndalusiaAcademy.API.Common.Security;

public sealed record AccessToken(string Token, DateTimeOffset ExpiresAt);

public interface ITokenService
{
    AccessToken CreateAccessToken(AppUser user, IReadOnlyCollection<string> roles);
}

public sealed class JwtTokenService : ITokenService
{
    private readonly JwtOptions _options;
    private readonly TimeProvider _clock;

    public JwtTokenService(IOptions<JwtOptions> options, TimeProvider clock)
    {
        _options = options.Value;
        _clock = clock;
    }

    public AccessToken CreateAccessToken(AppUser user, IReadOnlyCollection<string> roles)
    {
        var now = _clock.GetUtcNow();
        var expiresAt = now.AddMinutes(_options.AccessTokenMinutes);

        var claims = new List<Claim>
        {
            new(AppClaimTypes.UserId, user.Id.ToString()),
            new(AppClaimTypes.Email, user.Email),
            new(AppClaimTypes.SecurityStamp, user.SecurityStamp),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString("N"))
        };
        claims.AddRange(roles.Select(r => new Claim(AppClaimTypes.Role, r)));
        claims.AddRange(RolePermissionMatrix.PermissionsFor(roles).Select(p => new Claim(AppClaimTypes.Permission, p)));

        var credentials = new SigningCredentials(CreateSigningKey(_options.SigningKey), SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: _options.Issuer,
            audience: _options.Audience,
            claims: claims,
            notBefore: now.UtcDateTime,
            expires: expiresAt.UtcDateTime,
            signingCredentials: credentials);

        return new AccessToken(new JwtSecurityTokenHandler().WriteToken(token), expiresAt);
    }

    public static SymmetricSecurityKey CreateSigningKey(string key) => new(Encoding.UTF8.GetBytes(key));
}
