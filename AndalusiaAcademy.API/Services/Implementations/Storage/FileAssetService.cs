using AndalusiaAcademy.API.Data;
using AndalusiaAcademy.API.Exceptions;
using AndalusiaAcademy.API.Models.Content;
using AndalusiaAcademy.API.Services.Interfaces.Storage;

namespace AndalusiaAcademy.API.Services.Implementations.Storage;

public sealed class FileAssetService : IFileAssetService
{
    /// <summary>No antivirus engine is wired in yet; files are validated by type and signature only.</summary>
    public const string UnscannedStatus = "Unscanned";

    private readonly ApplicationDbContext _context;
    private readonly IFileStorage _storage;
    private readonly TimeProvider _clock;
    private readonly ILogger<FileAssetService> _logger;

    public FileAssetService(ApplicationDbContext context, IFileStorage storage, TimeProvider clock, ILogger<FileAssetService> logger)
    {
        _context = context;
        _storage = storage;
        _clock = clock;
        _logger = logger;
    }

    public async Task<IReadOnlyList<FileAsset>> StoreAsync(
        IReadOnlyList<IncomingFile> files, Guid uploadedByUserId, CancellationToken cancellationToken = default)
    {
        if (files.Count == 0)
        {
            return [];
        }

        if (files.Count > UploadLimits.MaxFilesPerUpload)
        {
            throw new BusinessRuleException($"You can upload at most {UploadLimits.MaxFilesPerUpload} files at once.");
        }

        // Validate everything first so a bad file never leaves a partial upload behind.
        var validated = new List<(IncomingFile File, UploadedFileValidator.ValidatedFile Result)>(files.Count);
        foreach (var file in files)
        {
            await using var stream = file.OpenRead();
            var header = new byte[UploadedFileValidator.HeaderLength];
            var read = await stream.ReadAtLeastAsync(header, header.Length, throwOnEndOfStream: false, cancellationToken);
            validated.Add((file, UploadedFileValidator.Validate(file.FileName, file.Length, header.AsSpan(0, read))));
        }

        var now = _clock.GetUtcNow();
        var assets = new List<FileAsset>(validated.Count);
        try
        {
            foreach (var (file, result) in validated)
            {
                var key = LocalFileStorage.NewObjectKey(now);
                await using (var stream = file.OpenRead())
                {
                    await _storage.SaveAsync(key, stream, cancellationToken);
                }

                var asset = new FileAsset
                {
                    ObjectKey = key,
                    OriginalName = result.DisplayName,
                    MediaType = result.MediaType,
                    SizeBytes = file.Length,
                    ScanStatus = UnscannedStatus,
                    UploadedAt = now,
                    UploadedByUserId = uploadedByUserId
                };
                assets.Add(asset);
                _context.FileAssets.Add(asset);
            }
        }
        catch
        {
            foreach (var asset in assets)
            {
                _context.Entry(asset).State = Microsoft.EntityFrameworkCore.EntityState.Detached;
            }

            await DiscardAsync(assets, CancellationToken.None);
            throw;
        }

        _logger.LogInformation("Stored {Count} uploaded file(s), {Bytes} bytes, for user {UserId}.",
            assets.Count, assets.Sum(a => a.SizeBytes), uploadedByUserId);
        return assets;
    }

    public async Task DiscardAsync(IEnumerable<FileAsset> assets, CancellationToken cancellationToken = default)
    {
        foreach (var asset in assets)
        {
            try
            {
                await _storage.DeleteAsync(asset.ObjectKey, cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Could not delete stored object for file {FileId}; it may be orphaned.", asset.Id);
            }
        }
    }
}
