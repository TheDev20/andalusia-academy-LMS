using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Options;
using AndalusiaAcademy.API.Common.Security;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.API.Models.Identity;

namespace AndalusiaAcademy.Tests.UnitTests.BusinessRules;

public class JwtTokenServiceTests
{
    private static readonly JwtOptions Options = new()
    {
        Issuer = "test-issuer",
        Audience = "test-audience",
        SigningKey = new string('k', 48),
        AccessTokenMinutes = 15
    };

    [Fact]
    public void Token_carries_identity_roles_permissions_and_security_stamp()
    {
        var user = new AppUser { Email = "a@b.test", SecurityStamp = "stamp-1" };
        var service = new JwtTokenService(Microsoft.Extensions.Options.Options.Create(Options), TimeProvider.System);

        var token = service.CreateAccessToken(user, [AppRoles.Learner]);
        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token.Token);

        Assert.Equal(user.Id.ToString(), jwt.Subject);
        Assert.Equal("test-issuer", jwt.Issuer);
        Assert.Contains("test-audience", jwt.Audiences);
        Assert.Contains(jwt.Claims, c => c.Type == AppClaimTypes.Role && c.Value == AppRoles.Learner);
        Assert.Contains(jwt.Claims, c => c.Type == AppClaimTypes.Permission && c.Value == PermissionCodes.ApplicationsApply);
        Assert.DoesNotContain(jwt.Claims, c => c.Type == AppClaimTypes.Permission && c.Value == PermissionCodes.UsersManage);
        Assert.Contains(jwt.Claims, c => c.Type == AppClaimTypes.SecurityStamp && c.Value == "stamp-1");
        Assert.InRange(token.ExpiresAt - DateTimeOffset.UtcNow, TimeSpan.FromMinutes(14), TimeSpan.FromMinutes(15));
    }
}
