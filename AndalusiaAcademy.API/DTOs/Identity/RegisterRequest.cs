namespace AndalusiaAcademy.API.DTOs.Identity;

public class RegisterRequest
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string CountryCode { get; set; } = "EG";
    public string PreferredLanguage { get; set; } = "ar";
}