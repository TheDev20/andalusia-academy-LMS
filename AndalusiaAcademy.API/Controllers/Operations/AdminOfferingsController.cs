using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AndalusiaAcademy.API.DTOs.Operations;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.API.Services.Interfaces.Operations;

namespace AndalusiaAcademy.API.Controllers.Operations;

/// <summary>
/// Course offerings (intakes), their instructors and learning materials.
/// </summary>
[ApiController]
[Route("api/admin/offerings")]
[Produces("application/json")]
[Authorize(Policy = PermissionCodes.SchedulesManage)]
public class AdminOfferingsController : ControllerBase
{
    private readonly IAdminOfferingService _offerings;

    public AdminOfferingsController(IAdminOfferingService offerings)
    {
        _offerings = offerings;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<AdminOfferingDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<AdminOfferingDto>>> List([FromQuery] Guid? courseId, CancellationToken cancellationToken) =>
        Ok(await _offerings.ListAsync(courseId, cancellationToken));

    [HttpGet("{offeringId:guid}")]
    [ProducesResponseType(typeof(AdminOfferingDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<AdminOfferingDto>> Get(Guid offeringId, CancellationToken cancellationToken) =>
        Ok(await _offerings.GetAsync(offeringId, cancellationToken));

    [HttpPost]
    [ProducesResponseType(typeof(AdminOfferingDto), StatusCodes.Status201Created)]
    public async Task<ActionResult<AdminOfferingDto>> Create(UpsertOfferingRequest request, CancellationToken cancellationToken)
    {
        var offering = await _offerings.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(Get), new { offeringId = offering.Id }, offering);
    }

    [HttpPut("{offeringId:guid}")]
    [ProducesResponseType(typeof(AdminOfferingDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult<AdminOfferingDto>> Update(Guid offeringId, UpsertOfferingRequest request, CancellationToken cancellationToken) =>
        Ok(await _offerings.UpdateAsync(offeringId, request, cancellationToken));

    [HttpPost("{offeringId:guid}/instructors")]
    [ProducesResponseType(typeof(AdminOfferingDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<AdminOfferingDto>> AssignInstructor(Guid offeringId, AssignInstructorRequest request, CancellationToken cancellationToken) =>
        Ok(await _offerings.AssignInstructorAsync(offeringId, request, cancellationToken));

    [HttpDelete("{offeringId:guid}/instructors/{instructorId:guid}")]
    [ProducesResponseType(typeof(AdminOfferingDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<AdminOfferingDto>> UnassignInstructor(Guid offeringId, Guid instructorId, CancellationToken cancellationToken) =>
        Ok(await _offerings.UnassignInstructorAsync(offeringId, instructorId, cancellationToken));

    [HttpGet("{offeringId:guid}/resources")]
    [ProducesResponseType(typeof(IReadOnlyList<AdminResourceDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<AdminResourceDto>>> ListResources(Guid offeringId, CancellationToken cancellationToken) =>
        Ok(await _offerings.ListResourcesAsync(offeringId, cancellationToken));

    [HttpPost("{offeringId:guid}/resources")]
    [ProducesResponseType(typeof(AdminResourceDto), StatusCodes.Status201Created)]
    public async Task<ActionResult<AdminResourceDto>> CreateResource(Guid offeringId, UpsertResourceRequest request, CancellationToken cancellationToken)
    {
        var resource = await _offerings.CreateResourceAsync(offeringId, request, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, resource);
    }

    [HttpPut("resources/{resourceId:guid}")]
    [ProducesResponseType(typeof(AdminResourceDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<AdminResourceDto>> UpdateResource(Guid resourceId, UpsertResourceRequest request, CancellationToken cancellationToken) =>
        Ok(await _offerings.UpdateResourceAsync(resourceId, request, cancellationToken));

    [HttpDelete("resources/{resourceId:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeleteResource(Guid resourceId, CancellationToken cancellationToken)
    {
        await _offerings.DeleteResourceAsync(resourceId, cancellationToken);
        return NoContent();
    }
}
