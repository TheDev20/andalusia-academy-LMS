namespace AndalusiaAcademy.API.Services.Implementations.Storage;

public sealed class FileStorageOptions
{
    public const string SectionName = "Storage";

    /// <summary>
    /// Directory that holds uploaded files. Must be outside the web root (files are never served statically) and on
    /// persistent storage. Defaults to <c>App_Data/files</c> under the content root.
    /// </summary>
    public string? RootPath { get; set; }
}
