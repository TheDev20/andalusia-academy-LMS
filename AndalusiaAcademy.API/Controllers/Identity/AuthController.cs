using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using AndalusiaAcademy.API.Common.Security;
using AndalusiaAcademy.API.DTOs.Identity;
using AndalusiaAcademy.API.Services.Interfaces.Identity;

namespace AndalusiaAcademy.API.Controllers.Identity;

/// <summary>
/// Registration, login/logout and password recovery.
/// </summary>
[ApiController]
[Route("api/auth")]
[Produces("application/json")]
[EnableRateLimiting(RateLimitPolicies.Auth)]
public class AuthController : ControllerBase
{
    private readonly IAuthService _auth;
    private readonly ICurrentUser _currentUser;

    public AuthController(IAuthService auth, ICurrentUser currentUser)
    {
        _auth = auth;
        _currentUser = currentUser;
    }

    /// <summary>Registers a new Learner account and returns an access token.</summary>
    [HttpPost("register")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request, CancellationToken cancellationToken)
    {
        var response = await _auth.RegisterAsync(request, cancellationToken);
        return Created("/api/me/profile", response);
    }

    /// <summary>Authenticates with e-mail and password.</summary>
    [HttpPost("login")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request, CancellationToken cancellationToken) =>
        Ok(await _auth.LoginAsync(request, cancellationToken));

    /// <summary>Revokes all access tokens issued to the caller.</summary>
    [HttpPost("logout")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Logout(CancellationToken cancellationToken)
    {
        await _auth.LogoutAsync(_currentUser.UserId, cancellationToken);
        return NoContent();
    }

    /// <summary>Starts password recovery. Always returns 202 to avoid revealing registered e-mails.</summary>
    [HttpPost("forgot-password")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ForgotPasswordResponse), StatusCodes.Status202Accepted)]
    public async Task<ActionResult<ForgotPasswordResponse>> ForgotPassword(ForgotPasswordRequest request, CancellationToken cancellationToken) =>
        Accepted(await _auth.ForgotPasswordAsync(request, cancellationToken));

    /// <summary>Completes password recovery with the token from the reset e-mail.</summary>
    [HttpPost("reset-password")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<IActionResult> ResetPassword(ResetPasswordRequest request, CancellationToken cancellationToken)
    {
        await _auth.ResetPasswordAsync(request, cancellationToken);
        return NoContent();
    }
}
