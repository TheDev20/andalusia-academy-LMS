using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using AndalusiaAcademy.API.Models.Content;

namespace AndalusiaAcademy.API.Data.Configurations;

public class FileAssetConfiguration : IEntityTypeConfiguration<FileAsset>
{
    public void Configure(EntityTypeBuilder<FileAsset> builder)
    {
        builder.ToTable("FileAsset");
        builder.HasKey(fa => fa.Id);

        builder.Property(fa => fa.ObjectKey).HasMaxLength(450).IsRequired();
        builder.HasIndex(fa => fa.ObjectKey).IsUnique();

        builder.Property(fa => fa.OriginalName).HasMaxLength(255).IsRequired();
        builder.Property(fa => fa.MediaType).HasMaxLength(120).IsRequired();
        builder.Property(fa => fa.ScanStatus).HasMaxLength(24).IsRequired();

        builder.HasOne(fa => fa.UploadedByUser)
            .WithMany()
            .HasForeignKey(fa => fa.UploadedByUserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class MediaAssetConfiguration : IEntityTypeConfiguration<MediaAsset>
{
    public void Configure(EntityTypeBuilder<MediaAsset> builder)
    {
        builder.ToTable("MediaAsset");
        builder.HasKey(ma => ma.Id);

        builder.Property(ma => ma.ObjectKey).HasMaxLength(450).IsRequired();
        builder.HasIndex(ma => ma.ObjectKey).IsUnique();

        builder.Property(ma => ma.AltText).HasMaxLength(500).IsRequired();
        builder.Property(ma => ma.MediaType).HasMaxLength(120).IsRequired();
        builder.Property(ma => ma.ScanStatus).HasMaxLength(24).IsRequired();

        builder.HasOne(ma => ma.UploadedByUser)
            .WithMany()
            .HasForeignKey(ma => ma.UploadedByUserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class PageConfiguration : IEntityTypeConfiguration<Page>
{
    public void Configure(EntityTypeBuilder<Page> builder)
    {
        builder.ToTable("Page");
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Title).HasMaxLength(250).IsRequired();
        builder.Property(p => p.Slug).HasMaxLength(160).IsRequired();
        builder.HasIndex(p => p.Slug).IsUnique();
        builder.Property(p => p.PublicationStatus).HasMaxLength(24).IsRequired();
        builder.Property(p => p.RowVersion).IsRowVersion();
    }
}

public class PageSectionConfiguration : IEntityTypeConfiguration<PageSection>
{
    public void Configure(EntityTypeBuilder<PageSection> builder)
    {
        builder.ToTable("PageSection");
        builder.HasKey(ps => ps.Id);

        builder.Property(ps => ps.BlockType).HasMaxLength(40).IsRequired();
        builder.HasIndex(ps => new { ps.PageId, ps.Sequence }).IsUnique();

        builder.HasOne(ps => ps.Page)
            .WithMany(p => p.Sections)
            .HasForeignKey(ps => ps.PageId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class PageSectionMediaConfiguration : IEntityTypeConfiguration<PageSectionMedia>
{
    public void Configure(EntityTypeBuilder<PageSectionMedia> builder)
    {
        builder.ToTable("PageSectionMedia");
        builder.HasKey(psm => new { psm.PageSectionId, psm.MediaAssetId });

        builder.HasIndex(psm => new { psm.PageSectionId, psm.Sequence }).IsUnique();

        builder.HasOne(psm => psm.PageSection)
            .WithMany(ps => ps.MediaItems)
            .HasForeignKey(psm => psm.PageSectionId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(psm => psm.MediaAsset)
            .WithMany()
            .HasForeignKey(psm => psm.MediaAssetId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class PartnerConfiguration : IEntityTypeConfiguration<Partner>
{
    public void Configure(EntityTypeBuilder<Partner> builder)
    {
        builder.ToTable("Partner");
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Name).HasMaxLength(250).IsRequired();
        builder.Property(p => p.AccreditationClassification).HasMaxLength(40).IsRequired();
        builder.Property(p => p.WebsiteUrl).HasMaxLength(1000);

        builder.HasOne(p => p.LogoMediaAsset)
            .WithMany()
            .HasForeignKey(p => p.LogoMediaAssetId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class TestimonialConfiguration : IEntityTypeConfiguration<Testimonial>
{
    public void Configure(EntityTypeBuilder<Testimonial> builder)
    {
        builder.ToTable("Testimonial");
        builder.HasKey(t => t.Id);

        builder.Property(t => t.AuthorName).HasMaxLength(200).IsRequired();
        builder.Property(t => t.PublicationStatus).HasMaxLength(24).IsRequired();

        builder.HasOne(t => t.MediaAsset)
            .WithMany()
            .HasForeignKey(t => t.MediaAssetId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class FAQConfiguration : IEntityTypeConfiguration<FAQ>
{
    public void Configure(EntityTypeBuilder<FAQ> builder)
    {
        builder.ToTable("FAQ");
        builder.HasKey(f => f.Id);

        builder.Property(f => f.Question).HasMaxLength(500).IsRequired();
        builder.Property(f => f.PublicationStatus).HasMaxLength(24).IsRequired();
    }
}

public class ResourceAssetConfiguration : IEntityTypeConfiguration<ResourceAsset>
{
    public void Configure(EntityTypeBuilder<ResourceAsset> builder)
    {
        builder.ToTable("ResourceAsset");
        builder.HasKey(ra => new { ra.ResourceId, ra.FileAssetId });

        builder.HasOne(ra => ra.Resource)
            .WithMany()
            .HasForeignKey(ra => ra.ResourceId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(ra => ra.FileAsset)
            .WithMany()
            .HasForeignKey(ra => ra.FileAssetId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class SubmissionAssetConfiguration : IEntityTypeConfiguration<SubmissionAsset>
{
    public void Configure(EntityTypeBuilder<SubmissionAsset> builder)
    {
        builder.ToTable("SubmissionAsset");
        builder.HasKey(sa => new { sa.SubmissionId, sa.FileAssetId });

        builder.HasOne(sa => sa.Submission)
            .WithMany()
            .HasForeignKey(sa => sa.SubmissionId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(sa => sa.FileAsset)
            .WithMany()
            .HasForeignKey(sa => sa.FileAssetId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
