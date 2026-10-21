using AndalusiaAcademy.API.DTOs.Identity;

namespace AndalusiaAcademy.API.Services.Interfaces.Identity;

public interface IProfileService
{
    Task<ProfileDto> GetAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<ProfileDto> UpdateAsync(Guid userId, UpdateProfileRequest request, CancellationToken cancellationToken = default);

    /// <summary>Changes the password and returns a fresh session (other sessions are revoked).</summary>
    Task<AuthResponse> ChangePasswordAsync(Guid userId, ChangePasswordRequest request, CancellationToken cancellationToken = default);
}
