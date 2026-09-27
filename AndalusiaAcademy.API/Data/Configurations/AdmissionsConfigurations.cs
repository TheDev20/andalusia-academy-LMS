using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using AndalusiaAcademy.API.Models.Admissions;
using AndalusiaAcademy.API.Models.Catalog;

namespace AndalusiaAcademy.API.Data.Configurations;

public class ApplicationConfiguration : IEntityTypeConfiguration<Application>
{
    public void Configure(EntityTypeBuilder<Application> builder)
    {
        builder.ToTable("Application");
        builder.HasKey(a => a.Id);
        builder.HasAlternateKey(a => new { a.Id, a.LearnerId });

        builder.Property(a => a.Status).HasMaxLength(24).IsRequired();
        builder.Property(a => a.RowVersion).IsRowVersion();

        builder.HasOne(a => a.Learner)
            .WithMany()
            .HasForeignKey(a => a.LearnerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(a => a.Offering)
            .WithMany()
            .HasForeignKey(a => a.OfferingId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class EnrollmentConfiguration : IEntityTypeConfiguration<Enrollment>
{
    public void Configure(EntityTypeBuilder<Enrollment> builder)
    {
        builder.ToTable("Enrollment");
        builder.HasKey(e => e.Id);
        builder.HasAlternateKey(e => new { e.Id, e.LearnerId });

        builder.Property(e => e.Status).HasMaxLength(24).IsRequired();
        builder.Property(e => e.RowVersion).IsRowVersion();

        builder.HasIndex(e => e.ApplicationId).IsUnique();

        builder.HasOne(e => e.Application)
            .WithOne(a => a.Enrollment)
            .HasPrincipalKey<Application>(a => new { a.Id, a.LearnerId })
            .HasForeignKey<Enrollment>(e => new { e.ApplicationId, e.LearnerId })
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Learner)
            .WithMany()
            .HasForeignKey(e => e.LearnerId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class LearningEnrollmentConfiguration : IEntityTypeConfiguration<LearningEnrollment>
{
    public void Configure(EntityTypeBuilder<LearningEnrollment> builder)
    {
        builder.ToTable("LearningEnrollment");
        builder.HasKey(le => le.Id);
        builder.HasAlternateKey(le => new { le.Id, le.CourseOfferingId });

        builder.Property(le => le.Status).HasMaxLength(24).IsRequired();
        builder.Property(le => le.CourseKind).HasMaxLength(8).IsRequired();
        builder.Property(le => le.RowVersion).IsRowVersion();

        builder.HasIndex(le => new { le.EnrollmentId, le.CourseOfferingId }).IsUnique();
        builder.HasIndex(le => new { le.LearnerId, le.CourseOfferingId })
            .IsUnique()
            .HasFilter("[Status] = 'Active'");

        builder.HasOne(le => le.Enrollment)
            .WithMany(e => e.LearningEnrollments)
            .HasPrincipalKey(e => new { e.Id, e.LearnerId })
            .HasForeignKey(le => new { le.EnrollmentId, le.LearnerId })
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(le => le.CourseOffering)
            .WithMany()
            .HasPrincipalKey(o => new { o.Id, o.Kind })
            .HasForeignKey(le => new { le.CourseOfferingId, le.CourseKind })
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(le => le.Learner)
            .WithMany()
            .HasForeignKey(le => le.LearnerId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
