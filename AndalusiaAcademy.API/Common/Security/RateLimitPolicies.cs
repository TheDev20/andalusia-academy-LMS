using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;

namespace AndalusiaAcademy.API.Common.Security;

public static class RateLimitPolicies
{
    public const string Auth = "auth";

    /// <summary>
    /// Per-client-IP fixed window on anonymous credential endpoints (brute-force / reset-spam protection).
    /// Limits are configurable via "RateLimiting:Auth".
    /// </summary>
    public static IServiceCollection AddAuthRateLimiting(this IServiceCollection services)
    {
        services.AddOptions<RateLimiterOptions>().Configure<IConfiguration>((options, configuration) =>
        {
            var permitLimit = configuration.GetValue("RateLimiting:Auth:PermitLimit", 10);
            var windowSeconds = configuration.GetValue("RateLimiting:Auth:WindowSeconds", 60);

            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
            options.AddPolicy(Auth, httpContext => RateLimitPartition.GetFixedWindowLimiter(
                httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = permitLimit,
                    Window = TimeSpan.FromSeconds(windowSeconds),
                    QueueLimit = 0
                }));
        });
        services.AddRateLimiter(_ => { });

        return services;
    }
}
