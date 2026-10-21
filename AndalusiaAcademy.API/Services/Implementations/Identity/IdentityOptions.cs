namespace AndalusiaAcademy.API.Services.Implementations.Identity;

/// <summary>Bound from the "Identity" configuration section.</summary>
public sealed class IdentityOptions
{
    public const string SectionName = "Identity";

    public int PasswordResetTokenMinutes { get; init; } = 30;

    /// <summary>
    /// Returns the raw reset token in the forgot-password response. Local demos only, until the
    /// notification worker (Final Sprint) delivers e-mail. Must stay false outside Development.
    /// </summary>
    public bool ExposeResetTokenInResponse { get; init; }
}
