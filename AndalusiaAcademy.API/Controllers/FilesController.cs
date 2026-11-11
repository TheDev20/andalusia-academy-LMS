using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AndalusiaAcademy.API.Services.Interfaces.Storage;

namespace AndalusiaAcademy.API.Controllers;

/// <summary>
/// Authorised download of uploaded course files (materials, assignment attachments and submissions).
/// </summary>
[ApiController]
[Route("api/files")]
[Authorize]
public class FilesController : ControllerBase
{
    private readonly IFileDownloadService _downloads;

    public FilesController(IFileDownloadService downloads)
    {
        _downloads = downloads;
    }

    /// <summary>Streams the file as an attachment. Requires access to the offering the file belongs to.</summary>
    [HttpGet("{fileId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Download(Guid fileId, CancellationToken cancellationToken)
    {
        var file = await _downloads.OpenAsync(fileId, cancellationToken);

        // Stored content is user-supplied: never let a browser sniff or render it inline.
        Response.Headers.XContentTypeOptions = "nosniff";
        Response.Headers.CacheControl = "private, no-store";
        return File(file.Content, file.MediaType, file.FileName);
    }
}
