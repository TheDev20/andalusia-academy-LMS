using AndalusiaAcademy.API.Models.Identity;
using AndalusiaAcademy.API.Models.Learning;

namespace AndalusiaAcademy.API.Models.Content;

public class FileAsset
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string ObjectKey { get; set; } = string.Empty;
    public string OriginalName { get; set; } = string.Empty;
    public string MediaType { get; set; } = string.Empty;
    public long SizeBytes { get; set; }
    public string ScanStatus { get; set; } = "Pending";
    public DateTimeOffset UploadedAt { get; set; } = DateTimeOffset.UtcNow;

    public Guid UploadedByUserId { get; set; }
    public AppUser UploadedByUser { get; set; } = null!;
}

public class MediaAsset
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string ObjectKey { get; set; } = string.Empty;
    public string AltText { get; set; } = string.Empty;
    public string MediaType { get; set; } = string.Empty;
    public long SizeBytes { get; set; }
    public string ScanStatus { get; set; } = "Pending";
    public DateTimeOffset UploadedAt { get; set; } = DateTimeOffset.UtcNow;

    public Guid UploadedByUserId { get; set; }
    public AppUser UploadedByUser { get; set; } = null!;
}

public class Page
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string PublicationStatus { get; set; } = "Published";
    public byte[] RowVersion { get; set; } = [];

    // Navigation
    public ICollection<PageSection> Sections { get; set; } = new List<PageSection>();
}

public class PageSection
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid PageId { get; set; }
    public Page Page { get; set; } = null!;

    public string BlockType { get; set; } = string.Empty;
    public string PayloadJson { get; set; } = "{}";
    public int Sequence { get; set; }

    // Navigation
    public ICollection<PageSectionMedia> MediaItems { get; set; } = new List<PageSectionMedia>();
}

public class PageSectionMedia
{
    public Guid PageSectionId { get; set; }
    public PageSection PageSection { get; set; } = null!;

    public Guid MediaAssetId { get; set; }
    public MediaAsset MediaAsset { get; set; } = null!;

    public int Sequence { get; set; }
}

public class Partner
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string AccreditationClassification { get; set; } = "Accredited";

    public Guid? LogoMediaAssetId { get; set; }
    public MediaAsset? LogoMediaAsset { get; set; }

    public string? WebsiteUrl { get; set; }
}

public class Testimonial
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string AuthorName { get; set; } = string.Empty;
    public string Quote { get; set; } = string.Empty;

    public Guid? MediaAssetId { get; set; }
    public MediaAsset? MediaAsset { get; set; }

    public string PublicationStatus { get; set; } = "Published";
}

public class FAQ
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Question { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;
    public int Sequence { get; set; }
    public string PublicationStatus { get; set; } = "Published";
}

public class ResourceAsset
{
    public Guid ResourceId { get; set; }
    public Resource Resource { get; set; } = null!;

    public Guid FileAssetId { get; set; }
    public FileAsset FileAsset { get; set; } = null!;
}

public class SubmissionAsset
{
    public Guid SubmissionId { get; set; }
    public Submission Submission { get; set; } = null!;

    public Guid FileAssetId { get; set; }
    public FileAsset FileAsset { get; set; } = null!;
}
