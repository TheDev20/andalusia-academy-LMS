using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AndalusiaAcademy.API.Controllers;

[ApiController]
[Route("api/uploads")]
[AllowAnonymous]
public class UploadsController : ControllerBase
{
    [HttpGet("{fileName}")]
    public IActionResult Get(string fileName)
    {
        var safeFileName = Path.GetFileName(fileName);
        var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", safeFileName);
        if (!System.IO.File.Exists(filePath))
            return NotFound();

        var ext = Path.GetExtension(safeFileName).ToLowerInvariant();
        var contentType = ext switch
        {
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".webp" => "image/webp",
            ".gif" => "image/gif",
            ".pdf" => "application/pdf",
            ".doc" => "application/msword",
            ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ".zip" => "application/zip",
            ".txt" => "text/plain",
            _ => "application/octet-stream"
        };

        return PhysicalFile(filePath, contentType);
    }
}
