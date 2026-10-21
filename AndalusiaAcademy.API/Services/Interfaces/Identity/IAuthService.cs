using AndalusiaAcademy.API.DTOs.Identity;

namespace AndalusiaAcademy.API.Services.Interfaces.Identity;

public interface IAuthService
{
    /// <summary>Creates a Learner account and returns an authenticated session.</summary>
    Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default);

    Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);

    /// <summary>Revokes every access token previously issued to the user.</summary>
    Task LogoutAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<ForgotPasswordResponse> ForgotPasswordAsync(ForgotPasswordRequest request, CancellationToken cancellationToken = default);

    Task ResetPasswordAsync(ResetPasswordRequest request, CancellationToken cancellationToken = default);
}
