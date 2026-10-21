using System.ComponentModel.DataAnnotations;

namespace AndalusiaAcademy.API.DTOs.Identity;

public sealed record ProfileDto(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    string? PhoneNumber,
    string CountryCode,
    string PreferredLanguage,
    DateTimeOffset CreatedAt,
    IReadOnlyList<string> Roles);

public sealed record UpdateProfileRequest(
    [Required, StringLength(100, MinimumLength = 1)] string FirstName,
    [Required, StringLength(100, MinimumLength = 1)] string LastName,
    [Phone, StringLength(50)] string? PhoneNumber,
    [Required, StringLength(2, MinimumLength = 2)] string CountryCode,
    [Required, StringLength(35, MinimumLength = 2)] string PreferredLanguage);
