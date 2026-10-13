using AndalusiaAcademy.API.DTOs.Identity;

namespace AndalusiaAcademy.API.Services.Interfaces.Identity;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<UserProfileDto> GetProfileAsync(Guid userId);
}