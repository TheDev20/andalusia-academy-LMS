using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AndalusiaAcademy.API.DTOs.Identity;
using AndalusiaAcademy.API.Services.Interfaces.Identity;

namespace AndalusiaAcademy.API.Controllers.Identity;

[ApiController]
[Route("api/v1/auth")]
[Produces("application/json")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
    {
        var response = await _authService.RegisterAsync(request);
        return StatusCode(StatusCodes.Status201Created, response);
    }

    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        var response = await _authService.LoginAsync(request);
        return Ok(response);
    }

    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(typeof(UserProfileDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<UserProfileDto>> GetProfile()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var profile = await _authService.GetProfileAsync(userId);
        return Ok(profile);
    }
}