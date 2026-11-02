using System.Security.Cryptography;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using AndalusiaAcademy.API.Data;

namespace AndalusiaAcademy.API.Common.Security;

public static class AuthenticationSetup
{
    /// <summary>
    /// Configures JWT bearer authentication, permission policies, and per-request security-stamp validation
    /// (logout, password reset and deactivation revoke previously issued tokens).
    /// </summary>
    public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        var fallbackSigningKey = Convert.ToBase64String(RandomNumberGenerator.GetBytes(48));

        services.AddOptions<JwtOptions>()
            .Bind(configuration.GetSection(JwtOptions.SectionName))
            .PostConfigure(o =>
            {
                if (string.IsNullOrWhiteSpace(o.SigningKey))
                {
                    o.SigningKey = fallbackSigningKey;
                }
            })
            .ValidateDataAnnotations()
            .Validate(o => System.Text.Encoding.UTF8.GetByteCount(o.SigningKey) >= 32,
                "Jwt:SigningKey must be at least 32 bytes. Configure it via user-secrets or environment variables.")
            .ValidateOnStart();

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer();

        // Bound through options (not read eagerly) so environment / host overrides of Jwt:* are honoured.
        services.AddOptions<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme)
            .Configure<IOptions<JwtOptions>>((options, jwtOptions) =>
            {
                var jwt = jwtOptions.Value;
                options.MapInboundClaims = false;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = jwt.Issuer,
                    ValidateAudience = true,
                    ValidAudience = jwt.Audience,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = JwtTokenService.CreateSigningKey(jwt.SigningKey),
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.FromSeconds(30),
                    NameClaimType = AppClaimTypes.UserId,
                    RoleClaimType = AppClaimTypes.Role
                };
                options.Events = new JwtBearerEvents
                {
                    OnTokenValidated = ValidateSecurityStampAsync
                };
            });

        services.AddAuthorizationBuilder().AddPermissionPolicies();
        services.AddSingleton<Microsoft.AspNetCore.Authorization.IAuthorizationHandler, PermissionAuthorizationHandler>();
        services.AddSingleton<ITokenService, JwtTokenService>();
        services.AddHttpContextAccessor();
        services.AddScoped<ICurrentUser, HttpContextCurrentUser>();

        return services;
    }

    private static async Task ValidateSecurityStampAsync(TokenValidatedContext context)
    {
        var principal = context.Principal;
        if (!Guid.TryParse(principal?.FindFirst(AppClaimTypes.UserId)?.Value, out var userId))
        {
            context.Fail("Token has no subject.");
            return;
        }

        var tokenStamp = principal!.FindFirst(AppClaimTypes.SecurityStamp)?.Value;
        var db = context.HttpContext.RequestServices.GetRequiredService<ApplicationDbContext>();
        var user = await db.AppUsers
            .AsNoTracking()
            .Where(u => u.Id == userId)
            .Select(u => new { u.SecurityStamp, u.IsActive })
            .FirstOrDefaultAsync(context.HttpContext.RequestAborted);

        if (user is null || !user.IsActive || !string.Equals(user.SecurityStamp, tokenStamp, StringComparison.Ordinal))
        {
            context.Fail("Token has been revoked.");
        }
    }
}
