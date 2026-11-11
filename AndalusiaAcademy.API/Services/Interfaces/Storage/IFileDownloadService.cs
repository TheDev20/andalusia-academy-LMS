namespace AndalusiaAcademy.API.Services.Interfaces.Storage;

public sealed record FileDownload(Stream Content, string FileName, string MediaType, long SizeBytes);

/// <summary>Opens a stored file for the current caller after resource-level authorisation.</summary>
public interface IFileDownloadService
{
    /// <summary>
    /// Admins and instructors assigned to the owning offering may read any file of it; learners may read published
    /// materials and assignment attachments of offerings they are actively enrolled in, and their own submissions.
    /// </summary>
    Task<FileDownload> OpenAsync(Guid fileId, CancellationToken cancellationToken = default);
}
