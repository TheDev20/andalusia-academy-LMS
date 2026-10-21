using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AndalusiaAcademy.API.Common.Security;
using AndalusiaAcademy.API.DTOs.Admissions;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.API.Services.Interfaces.Admissions;

namespace AndalusiaAcademy.API.Controllers.Admissions;

/// <summary>
/// Learner applications ("Apply / Enroll" from course or program details) and My Applications.
/// </summary>
[ApiController]
[Route("api/applications")]
[Produces("application/json")]
[Authorize(Policy = PermissionCodes.ApplicationsApply)]
public class ApplicationsController : ControllerBase
{
    private readonly IApplicationService _applications;
    private readonly ICurrentUser _currentUser;

    public ApplicationsController(IApplicationService applications, ICurrentUser currentUser)
    {
        _applications = applications;
        _currentUser = currentUser;
    }

    /// <summary>Submits an application for a published offering and holds a seat while payment is pending.</summary>
    [HttpPost]
    [ProducesResponseType(typeof(ApplicationDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult<ApplicationDto>> Submit(CreateApplicationRequest request, CancellationToken cancellationToken)
    {
        var application = await _applications.SubmitAsync(_currentUser.UserId, request, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { applicationId = application.Id }, application);
    }

    /// <summary>My Applications.</summary>
    [HttpGet("mine")]
    [ProducesResponseType(typeof(IReadOnlyList<ApplicationDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<ApplicationDto>>> GetMine(CancellationToken cancellationToken) =>
        Ok(await _applications.GetForLearnerAsync(_currentUser.UserId, cancellationToken));

    [HttpGet("{applicationId:guid}")]
    [ProducesResponseType(typeof(ApplicationDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApplicationDto>> GetById(Guid applicationId, CancellationToken cancellationToken) =>
        Ok(await _applications.GetForLearnerAsync(_currentUser.UserId, applicationId, cancellationToken));

    /// <summary>Withdraws a submitted (unpaid) application and releases its seat.</summary>
    [HttpPost("{applicationId:guid}/cancel")]
    [ProducesResponseType(typeof(ApplicationDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult<ApplicationDto>> Cancel(Guid applicationId, CancellationToken cancellationToken) =>
        Ok(await _applications.CancelAsync(_currentUser.UserId, applicationId, cancellationToken));
}
