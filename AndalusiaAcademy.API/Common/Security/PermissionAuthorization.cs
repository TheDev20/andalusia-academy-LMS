using Microsoft.AspNetCore.Authorization;
using AndalusiaAcademy.API.ENUMs;

namespace AndalusiaAcademy.API.Common.Security;

/// <summary>
/// Requires the caller's token to carry a specific <c>perm</c> claim.
/// </summary>
public sealed class PermissionRequirement : IAuthorizationRequirement
{
    public PermissionRequirement(string permission)
    {
        Permission = permission;
    }

    public string Permission { get; }
}

public sealed class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionRequirement requirement)
    {
        if (context.User.HasClaim(AppClaimTypes.Permission, requirement.Permission))
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}

public static class PermissionPolicyExtensions
{
    /// <summary>
    /// Registers one authorization policy per permission code, so endpoints use
    /// <c>[Authorize(Policy = PermissionCodes.X)]</c>.
    /// </summary>
    public static AuthorizationBuilder AddPermissionPolicies(this AuthorizationBuilder builder)
    {
        foreach (var permission in PermissionCodes.All)
        {
            builder.AddPolicy(permission, policy => policy
                .RequireAuthenticatedUser()
                .AddRequirements(new PermissionRequirement(permission)));
        }

        return builder;
    }
}
