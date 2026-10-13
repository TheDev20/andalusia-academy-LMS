namespace AndalusiaAcademy.API.DTOs.Identity;

public class UserProfileDto
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string CountryCode { get; set; } = "EG";
    public string PreferredLanguage { get; set; } = "ar";
    public IEnumerable<string> Roles { get; set; } = new List<string>();
    public DateTimeOffset CreatedAt { get; set; }
}