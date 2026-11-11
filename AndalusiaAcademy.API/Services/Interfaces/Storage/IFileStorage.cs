namespace AndalusiaAcademy.API.Services.Interfaces.Storage;

/// <summary>
/// Blob storage for uploaded files, addressed by an opaque server-generated object key.
/// Implementations must never expose objects over a public URL; access goes through the authorised download endpoint.
/// </summary>
public interface IFileStorage
{
    Task SaveAsync(string objectKey, Stream content, CancellationToken cancellationToken = default);

    /// <summary>Opens the object for reading. Throws <see cref="FileNotFoundException"/> when it does not exist.</summary>
    Task<Stream> OpenReadAsync(string objectKey, CancellationToken cancellationToken = default);

    /// <summary>Deletes the object. Succeeds when it is already gone.</summary>
    Task DeleteAsync(string objectKey, CancellationToken cancellationToken = default);
}
