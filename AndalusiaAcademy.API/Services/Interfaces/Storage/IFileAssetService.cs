using AndalusiaAcademy.API.Models.Content;

namespace AndalusiaAcademy.API.Services.Interfaces.Storage;

/// <summary>An uploaded file as received by an endpoint, independent of the web framework type.</summary>
public sealed record IncomingFile(string FileName, long Length, Func<Stream> OpenRead);

/// <summary>
/// Validates uploaded files, writes them to private storage and registers a <see cref="FileAsset"/> row for each.
/// </summary>
public interface IFileAssetService
{
    /// <summary>
    /// Validates every file before writing any, stores them, and adds one <see cref="FileAsset"/> per file to the
    /// current unit of work (the caller links and saves). If the caller's save fails it must call
    /// <see cref="DiscardAsync"/> so no orphaned object stays in storage.
    /// </summary>
    Task<IReadOnlyList<FileAsset>> StoreAsync(IReadOnlyList<IncomingFile> files, Guid uploadedByUserId, CancellationToken cancellationToken = default);

    /// <summary>Removes the stored objects (best effort; never throws for a missing object).</summary>
    Task DiscardAsync(IEnumerable<FileAsset> assets, CancellationToken cancellationToken = default);
}
