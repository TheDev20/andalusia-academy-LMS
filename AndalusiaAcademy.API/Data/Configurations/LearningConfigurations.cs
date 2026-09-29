using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using AndalusiaAcademy.API.Models.Learning;
using AndalusiaAcademy.API.Models.Catalog;
using AndalusiaAcademy.API.Models.Admissions;

namespace AndalusiaAcademy.API.Data.Configurations;

public class LocationConfiguration : IEntityTypeConfiguration<Location>
{
    public void Configure(EntityTypeBuilder<Location> builder)
    {
        builder.ToTable("Location");
        builder.HasKey(l => l.Id);

        builder.Property(l => l.Name).HasMaxLength(200).IsRequired();
        builder.Property(l => l.Address).HasMaxLength(500);
        builder.Property(l => l.MeetingUrl).HasMaxLength(1000);
    }
}

public class OfferingInstructorConfiguration : IEntityTypeConfiguration<OfferingInstructor>
{
    public void Configure(EntityTypeBuilder<OfferingInstructor> builder)
    {
        builder.ToTable("OfferingInstructor");
        builder.HasKey(oi => new { oi.OfferingId, oi.InstructorId });

        builder.HasOne(oi => oi.Offering)
            .WithMany()
            .HasForeignKey(oi => oi.OfferingId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(oi => oi.Instructor)
            .WithMany()
            .HasForeignKey(oi => oi.InstructorId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class SessionConfiguration : IEntityTypeConfiguration<Session>
{
    public void Configure(EntityTypeBuilder<Session> builder)
    {
        builder.ToTable("Session");
        builder.HasKey(s => s.Id);
        builder.HasAlternateKey(s => new { s.Id, s.CourseOfferingId });

        builder.Property(s => s.Title).HasMaxLength(250).IsRequired();
        builder.Property(s => s.CourseKind).HasMaxLength(8).IsRequired();
        builder.Property(s => s.Status).HasMaxLength(24).IsRequired();
        builder.Property(s => s.RowVersion).IsRowVersion();

        builder.HasOne(s => s.CourseOffering)
            .WithMany()
            .HasPrincipalKey(o => new { o.Id, o.Kind })
            .HasForeignKey(s => new { s.CourseOfferingId, s.CourseKind })
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(s => s.Location)
            .WithMany(l => l.Sessions)
            .HasForeignKey(s => s.LocationId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class AssignmentConfiguration : IEntityTypeConfiguration<Assignment>
{
    public void Configure(EntityTypeBuilder<Assignment> builder)
    {
        builder.ToTable("Assignment");
        builder.HasKey(a => a.Id);
        builder.HasAlternateKey(a => new { a.Id, a.CourseOfferingId });

        builder.Property(a => a.Title).HasMaxLength(250).IsRequired();
        builder.Property(a => a.CourseKind).HasMaxLength(8).IsRequired();
        builder.Property(a => a.MaxScore).HasPrecision(19, 4);
        builder.Property(a => a.Status).HasMaxLength(24).IsRequired();
        builder.Property(a => a.RowVersion).IsRowVersion();

        builder.HasOne(a => a.CourseOffering)
            .WithMany()
            .HasPrincipalKey(o => new { o.Id, o.Kind })
            .HasForeignKey(a => new { a.CourseOfferingId, a.CourseKind })
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class ResourceConfiguration : IEntityTypeConfiguration<Resource>
{
    public void Configure(EntityTypeBuilder<Resource> builder)
    {
        builder.ToTable("Resource");
        builder.HasKey(r => r.Id);
        builder.HasAlternateKey(r => new { r.Id, r.CourseOfferingId });

        builder.Property(r => r.Title).HasMaxLength(250).IsRequired();
        builder.Property(r => r.CourseKind).HasMaxLength(8).IsRequired();
        builder.Property(r => r.RowVersion).IsRowVersion();

        builder.HasIndex(r => new { r.CourseOfferingId, r.Sequence }).IsUnique();

        builder.HasOne(r => r.CourseOffering)
            .WithMany()
            .HasPrincipalKey(o => new { o.Id, o.Kind })
            .HasForeignKey(r => new { r.CourseOfferingId, r.CourseKind })
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class AttendanceConfiguration : IEntityTypeConfiguration<Attendance>
{
    public void Configure(EntityTypeBuilder<Attendance> builder)
    {
        builder.ToTable("Attendance");
        builder.HasKey(a => new { a.SessionId, a.LearningEnrollmentId });

        builder.Property(a => a.Status).HasMaxLength(24).IsRequired();
        builder.Property(a => a.RowVersion).IsRowVersion();

        builder.HasOne(a => a.Session)
            .WithMany(s => s.Attendances)
            .HasPrincipalKey(s => new { s.Id, s.CourseOfferingId })
            .HasForeignKey(a => new { a.SessionId, a.CourseOfferingId })
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(a => a.LearningEnrollment)
            .WithMany()
            .HasPrincipalKey(le => new { le.Id, le.CourseOfferingId })
            .HasForeignKey(a => new { a.LearningEnrollmentId, a.CourseOfferingId })
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(a => a.RecordedByUser)
            .WithMany()
            .HasForeignKey(a => a.RecordedByUserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class AttendanceCorrectionConfiguration : IEntityTypeConfiguration<AttendanceCorrection>
{
    public void Configure(EntityTypeBuilder<AttendanceCorrection> builder)
    {
        builder.ToTable("AttendanceCorrection");
        builder.HasKey(ac => ac.Id);

        builder.Property(ac => ac.OldStatus).HasMaxLength(24).IsRequired();
        builder.Property(ac => ac.NewStatus).HasMaxLength(24).IsRequired();
        builder.Property(ac => ac.Reason).HasMaxLength(1000).IsRequired();

        builder.HasOne(ac => ac.Attendance)
            .WithMany(a => a.Corrections)
            .HasForeignKey(ac => new { ac.SessionId, ac.LearningEnrollmentId })
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(ac => ac.ActorUser)
            .WithMany()
            .HasForeignKey(ac => ac.ActorUserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class SubmissionConfiguration : IEntityTypeConfiguration<Submission>
{
    public void Configure(EntityTypeBuilder<Submission> builder)
    {
        builder.ToTable("Submission");
        builder.HasKey(s => s.Id);

        builder.Property(s => s.Score).HasPrecision(19, 4);
        builder.Property(s => s.RowVersion).IsRowVersion();

        builder.HasIndex(s => new { s.AssignmentId, s.LearningEnrollmentId, s.AttemptNumber }).IsUnique();

        builder.HasOne(s => s.Assignment)
            .WithMany(a => a.Submissions)
            .HasPrincipalKey(a => new { a.Id, a.CourseOfferingId })
            .HasForeignKey(s => new { s.AssignmentId, s.CourseOfferingId })
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(s => s.LearningEnrollment)
            .WithMany()
            .HasPrincipalKey(le => new { le.Id, le.CourseOfferingId })
            .HasForeignKey(s => new { s.LearningEnrollmentId, s.CourseOfferingId })
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(s => s.GradedByUser)
            .WithMany()
            .HasForeignKey(s => s.GradedByUserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class ResourceProgressConfiguration : IEntityTypeConfiguration<ResourceProgress>
{
    public void Configure(EntityTypeBuilder<ResourceProgress> builder)
    {
        builder.ToTable("ResourceProgress");
        builder.HasKey(rp => new { rp.ResourceId, rp.LearningEnrollmentId });

        builder.HasOne(rp => rp.Resource)
            .WithMany(r => r.ProgressRecords)
            .HasPrincipalKey(r => new { r.Id, r.CourseOfferingId })
            .HasForeignKey(rp => new { rp.ResourceId, rp.CourseOfferingId })
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(rp => rp.LearningEnrollment)
            .WithMany()
            .HasPrincipalKey(le => new { le.Id, le.CourseOfferingId })
            .HasForeignKey(rp => new { rp.LearningEnrollmentId, rp.CourseOfferingId })
            .OnDelete(DeleteBehavior.Restrict);
    }
}
