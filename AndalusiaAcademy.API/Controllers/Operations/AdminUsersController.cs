using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AndalusiaAcademy.API.DTOs.Common;
using AndalusiaAcademy.API.DTOs.Operations;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.API.Services.Interfaces.Operations;

namespace AndalusiaAcademy.API.Controllers.Operations;

/// <summary>
/// Student and instructor management.
/// </summary>
[ApiController]
[Route("api/admin/users")]
[Produces("application/json")]
[Authorize(Policy = PermissionCodes.UsersManage)]
public class AdminUsersController : ControllerBase
{
    private readonly IAdminUserService _users;

    public AdminUsersController(IAdminUserService users)
    {
        _users = users;
    }

    /// <summary>Lists users; filter with <c>role=Learner</c> for students or <c>role=Instructor</c> for instructors.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<AdminUserDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedResult<AdminUserDto>>> List([FromQuery] AdminUserQuery query, CancellationToken cancellationToken) =>
        Ok(await _users.ListAsync(query, cancellationToken));

    [HttpGet("{userId:guid}")]
    [ProducesResponseType(typeof(AdminUserDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<AdminUserDto>> Get(Guid userId, CancellationToken cancellationToken) =>
        Ok(await _users.GetAsync(userId, cancellationToken));

    [HttpPost("instructors")]
    [ProducesResponseType(typeof(AdminUserDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<AdminUserDto>> CreateInstructor(CreateInstructorRequest request, CancellationToken cancellationToken)
    {
        var user = await _users.CreateInstructorAsync(request, cancellationToken);
        return CreatedAtAction(nameof(Get), new { userId = user.Id }, user);
    }

    /// <summary>Activates or deactivates an account; deactivation revokes the user's tokens.</summary>
    [HttpPut("{userId:guid}/status")]
    [ProducesResponseType(typeof(AdminUserDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<AdminUserDto>> SetStatus(Guid userId, SetUserStatusRequest request, CancellationToken cancellationToken) =>
        Ok(await _users.SetStatusAsync(userId, request, cancellationToken));

    /// <summary>Replaces the user's roles; the user must sign in again for new permissions to apply.</summary>
    [HttpPut("{userId:guid}/roles")]
    [ProducesResponseType(typeof(AdminUserDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<AdminUserDto>> SetRoles(Guid userId, SetUserRolesRequest request, CancellationToken cancellationToken) =>
        Ok(await _users.SetRolesAsync(userId, request, cancellationToken));
}
