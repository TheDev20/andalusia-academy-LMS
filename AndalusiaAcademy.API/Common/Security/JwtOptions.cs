using System.ComponentModel.DataAnnotations;

namespace AndalusiaAcademy.API.Common.Security;

/// <summary>
/// JWT issuance settings bound from the "Jwt" configuration section.
/// <see cref="SigningKey"/> must come from user-secrets / environment configuration, never source control.
/// </summary>
public sealed class JwtOptions
{
    public const string SectionName = "Jwt";

    [Required]
    public string Issuer { get; init; } = "AndalusiaAcademy";

    [Required]
    public string Audience { get; init; } = "AndalusiaAcademy.Clients";

    /// <summary>HMAC-SHA256 key; at least 32 bytes (UTF-8).</summary>
    [Required, MinLength(32)]
    public string SigningKey { get; init; } = string.Empty;

    [Range(5, 1440)]
    public int AccessTokenMinutes { get; init; } = 60;
}
