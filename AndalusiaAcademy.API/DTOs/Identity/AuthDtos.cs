using System.ComponentModel.DataAnnotations;

namespace AndalusiaAcademy.API.DTOs.Identity;

public sealed record RegisterRequest(
    [Required, StringLength(100, MinimumLength = 1)] string FirstName,
    [Required, StringLength(100, MinimumLength = 1)] string LastName,
    [Required, EmailAddress, StringLength(256)] string Email,
    [Required, StringLength(128, MinimumLength = PasswordRules.MinLength)] string Password,
    [Phone, StringLength(50)] string? PhoneNumber,
    [StringLength(2, MinimumLength = 2)] string? CountryCode,
    [StringLength(35)] string? PreferredLanguage);

public sealed record LoginRequest(
    [Required, EmailAddress] string Email,
    [Required] string Password);

public sealed record ForgotPasswordRequest(
    [Required, EmailAddress] string Email);

public sealed record ResetPasswordRequest(
    [Required, EmailAddress] string Email,
    [Required, StringLength(200)] string Token,
    [Required, StringLength(128, MinimumLength = PasswordRules.MinLength)] string NewPassword);

public sealed record ChangePasswordRequest(
    [Required] string CurrentPassword,
    [Required, StringLength(128, MinimumLength = PasswordRules.MinLength)] string NewPassword);

public sealed record AuthResponse(
    string AccessToken,
    string TokenType,
    DateTimeOffset ExpiresAt,
    UserSummaryDto User);

public sealed record UserSummaryDto(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    IReadOnlyList<string> Roles,
    IReadOnlyList<string> Permissions);

/// <summary>
/// Forgot-password always returns the same message to prevent account enumeration.
/// <see cref="DevelopmentResetToken"/> is populated only when explicitly enabled for local demos.
/// </summary>
public sealed record ForgotPasswordResponse(string Message, string? DevelopmentResetToken);

public static class PasswordRules
{
    public const int MinLength = 8;
}
