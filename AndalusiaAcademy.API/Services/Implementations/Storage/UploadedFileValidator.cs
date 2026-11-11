using AndalusiaAcademy.API.Exceptions;
using AndalusiaAcademy.API.Services.Interfaces.Storage;

namespace AndalusiaAcademy.API.Services.Implementations.Storage;

/// <summary>
/// Pure validation of an uploaded file: name, size, extension allow-list and a content signature check, so a
/// renamed executable cannot pass as a document. The client-supplied content type is never trusted.
/// </summary>
public static class UploadedFileValidator
{
    /// <summary>Number of leading bytes the signature check needs.</summary>
    public const int HeaderLength = 8192;

    public sealed record ValidatedFile(string DisplayName, string MediaType);

    private enum Signature { Pdf, Png, Jpeg, Zip, LegacyOffice, Text }

    private static readonly Dictionary<string, (string MediaType, Signature Signature)> Allowed = new(StringComparer.OrdinalIgnoreCase)
    {
        [".pdf"] = ("application/pdf", Signature.Pdf),
        [".png"] = ("image/png", Signature.Png),
        [".jpg"] = ("image/jpeg", Signature.Jpeg),
        [".jpeg"] = ("image/jpeg", Signature.Jpeg),
        [".docx"] = ("application/vnd.openxmlformats-officedocument.wordprocessingml.document", Signature.Zip),
        [".pptx"] = ("application/vnd.openxmlformats-officedocument.presentationml.presentation", Signature.Zip),
        [".xlsx"] = ("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", Signature.Zip),
        [".zip"] = ("application/zip", Signature.Zip),
        [".doc"] = ("application/msword", Signature.LegacyOffice),
        [".ppt"] = ("application/vnd.ms-powerpoint", Signature.LegacyOffice),
        [".xls"] = ("application/vnd.ms-excel", Signature.LegacyOffice),
        [".txt"] = ("text/plain", Signature.Text),
        [".csv"] = ("text/csv", Signature.Text),
        [".md"] = ("text/markdown", Signature.Text),
    };

    public static string AllowedExtensionsDescription => string.Join(", ", Allowed.Keys.Order());

    public static ValidatedFile Validate(string fileName, long length, ReadOnlySpan<byte> header)
    {
        if (length <= 0)
        {
            throw new BusinessRuleException("The file is empty.");
        }

        if (length > UploadLimits.MaxFileBytes)
        {
            throw new BusinessRuleException($"Each file must be {UploadLimits.MaxFileBytes / (1024 * 1024)} MB or smaller.");
        }

        var displayName = SanitiseName(fileName);
        var extension = Path.GetExtension(displayName);
        if (!Allowed.TryGetValue(extension, out var rule))
        {
            throw new BusinessRuleException($"This file type is not allowed. Allowed types: {AllowedExtensionsDescription}.");
        }

        if (!MatchesSignature(rule.Signature, header))
        {
            throw new BusinessRuleException($"The content of \"{displayName}\" does not match its {extension} file type.");
        }

        return new ValidatedFile(displayName, rule.MediaType);
    }

    /// <summary>Keeps only a safe display name: no path parts, no control characters, bounded length, extension kept.</summary>
    public static string SanitiseName(string? fileName)
    {
        var name = Path.GetFileName((fileName ?? string.Empty).Replace('\\', '/'));
        name = new string(name.Where(c => !char.IsControl(c)).ToArray()).Trim();
        if (name.Length == 0 || name.StartsWith('.') && Path.GetExtension(name) == name)
        {
            return "file";
        }

        if (name.Length > UploadLimits.MaxDisplayNameLength)
        {
            var extension = Path.GetExtension(name);
            var stem = Path.GetFileNameWithoutExtension(name);
            name = stem[..Math.Max(1, UploadLimits.MaxDisplayNameLength - extension.Length)] + extension;
        }

        return name;
    }

    private static bool MatchesSignature(Signature signature, ReadOnlySpan<byte> header) => signature switch
    {
        Signature.Pdf => header.StartsWith("%PDF-"u8),
        Signature.Png => header.StartsWith(new byte[] { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A }),
        Signature.Jpeg => header.StartsWith(new byte[] { 0xFF, 0xD8, 0xFF }),
        Signature.Zip => header.StartsWith(new byte[] { 0x50, 0x4B, 0x03, 0x04 }),
        Signature.LegacyOffice => header.StartsWith(new byte[] { 0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1 }),
        Signature.Text => !header.Contains((byte)0),
        _ => false
    };
}
