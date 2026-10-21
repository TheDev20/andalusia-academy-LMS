namespace AndalusiaAcademy.API.Common.Security;

/// <summary>
/// Claim names used in issued access tokens. Inbound claim mapping is disabled, so these are read verbatim.
/// </summary>
public static class AppClaimTypes
{
    public const string UserId = "sub";
    public const string Email = "email";
    public const string Role = "role";
    public const string Permission = "perm";
    public const string SecurityStamp = "sstamp";
}
