namespace AndalusiaAcademy.API.Services.Interfaces.Storage;

/// <summary>Upload limits shared by validation and the request-size attributes on upload endpoints.</summary>
public static class UploadLimits
{
    public const long MaxFileBytes = 25 * 1024 * 1024;
    public const int MaxFilesPerUpload = 5;

    /// <summary>Files that may be attached to one material or one assignment brief in total.</summary>
    public const int MaxFilesPerOwner = 10;

    /// <summary>Whole multipart request: a few files plus form overhead. Rejected by Kestrel before buffering.</summary>
    public const long MaxRequestBytes = 55 * 1024 * 1024;

    public const int MaxDisplayNameLength = 255;
}
