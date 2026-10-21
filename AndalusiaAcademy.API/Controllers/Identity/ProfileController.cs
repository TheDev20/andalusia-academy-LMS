using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AndalusiaAcademy.API.Common.Security;
using AndalusiaAcademy.API.DTOs.Identity;
using AndalusiaAcademy.API.Services.Interfaces.Identity;

namespace AndalusiaAcademy.API.Controllers.Identity;

/// <summary>
/// Self-service profile management for any authenticated user.
/// </summary>
[ApiController]
[Route("api/me")]
[Produces("application/json")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly IProfileService _profiles;
    private readonly ICurrentUser _currentUser;

    public ProfileController(IProfileService profiles, ICurrentUser currentUser)
    {
        _profiles = profiles;
        _currentUser = currentUser;
    }

    [HttpGet("profile")]
    [ProducesResponseType(typeof(ProfileDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<ProfileDto>> Get(CancellationToken cancellationToken) =>
        Ok(await _profiles.GetAsync(_currentUser.UserId, cancellationToken));

    [HttpPut("profile")]
    [ProducesResponseType(typeof(ProfileDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<ProfileDto>> Update(UpdateProfileRequest request, CancellationToken cancellationToken) =>
        Ok(await _profiles.UpdateAsync(_currentUser.UserId, request, cancellationToken));

    /// <summary>Changes the password, revokes other sessions and returns a fresh token.</summary>
    [HttpPost("change-password")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult<AuthResponse>> ChangePassword(ChangePasswordRequest request, CancellationToken cancellationToken) =>
        Ok(await _profiles.ChangePasswordAsync(_currentUser.UserId, request, cancellationToken));
}
