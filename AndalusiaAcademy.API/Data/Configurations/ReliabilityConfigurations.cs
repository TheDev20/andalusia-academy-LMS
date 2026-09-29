using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using AndalusiaAcademy.API.Models.Reliability;

namespace AndalusiaAcademy.API.Data.Configurations;

public class AnnouncementConfiguration : IEntityTypeConfiguration<Announcement>
{
    public void Configure(EntityTypeBuilder<Announcement> builder)
    {
        builder.ToTable("Announcement");
        builder.HasKey(a => a.Id);

        builder.Property(a => a.Title).HasMaxLength(250).IsRequired();

        builder.HasOne(a => a.Offering)
            .WithMany()
            .HasForeignKey(a => a.OfferingId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(a => a.AuthorUser)
            .WithMany()
            .HasForeignKey(a => a.AuthorUserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class NotificationRecipientConfiguration : IEntityTypeConfiguration<NotificationRecipient>
{
    public void Configure(EntityTypeBuilder<NotificationRecipient> builder)
    {
        builder.ToTable("NotificationRecipient");
        builder.HasKey(nr => nr.Id);

        builder.Property(nr => nr.Channel).HasMaxLength(24).IsRequired();
        builder.Property(nr => nr.Destination).HasMaxLength(320).IsRequired();
        builder.Property(nr => nr.Status).HasMaxLength(24).IsRequired();
        builder.Property(nr => nr.RowVersion).IsRowVersion();

        builder.HasIndex(nr => new { nr.AnnouncementId, nr.UserId, nr.Channel }).IsUnique();

        builder.HasOne(nr => nr.Announcement)
            .WithMany(a => a.NotificationRecipients)
            .HasForeignKey(nr => nr.AnnouncementId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(nr => nr.User)
            .WithMany()
            .HasForeignKey(nr => nr.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class DeliveryAttemptConfiguration : IEntityTypeConfiguration<DeliveryAttempt>
{
    public void Configure(EntityTypeBuilder<DeliveryAttempt> builder)
    {
        builder.ToTable("DeliveryAttempt");
        builder.HasKey(da => da.Id);

        builder.Property(da => da.Provider).HasMaxLength(60).IsRequired();
        builder.Property(da => da.ProviderReference).HasMaxLength(200);
        builder.Property(da => da.Status).HasMaxLength(24).IsRequired();
        builder.Property(da => da.Error).HasMaxLength(2000);

        builder.HasIndex(da => new { da.NotificationRecipientId, da.AttemptNumber }).IsUnique();

        builder.HasOne(da => da.NotificationRecipient)
            .WithMany(nr => nr.DeliveryAttempts)
            .HasForeignKey(da => da.NotificationRecipientId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class OutboxMessageConfiguration : IEntityTypeConfiguration<OutboxMessage>
{
    public void Configure(EntityTypeBuilder<OutboxMessage> builder)
    {
        builder.ToTable("OutboxMessage");
        builder.HasKey(om => om.Id);

        builder.Property(om => om.DeduplicationKey).HasMaxLength(200).IsRequired();
        builder.HasIndex(om => om.DeduplicationKey).IsUnique();

        builder.Property(om => om.Type).HasMaxLength(150).IsRequired();
        builder.Property(om => om.LeaseOwner).HasMaxLength(100);
        builder.Property(om => om.LastError).HasMaxLength(2000);
        builder.Property(om => om.RowVersion).IsRowVersion();
    }
}

public class JobExecutionConfiguration : IEntityTypeConfiguration<JobExecution>
{
    public void Configure(EntityTypeBuilder<JobExecution> builder)
    {
        builder.ToTable("JobExecution");
        builder.HasKey(je => je.Id);

        builder.Property(je => je.WorkerId).HasMaxLength(100).IsRequired();
        builder.Property(je => je.Status).HasMaxLength(24).IsRequired();
        builder.Property(je => je.Error).HasMaxLength(2000);

        builder.HasIndex(je => new { je.OutboxMessageId, je.AttemptNumber }).IsUnique();

        builder.HasOne(je => je.OutboxMessage)
            .WithMany(om => om.JobExecutions)
            .HasForeignKey(je => je.OutboxMessageId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class AuditEventConfiguration : IEntityTypeConfiguration<AuditEvent>
{
    public void Configure(EntityTypeBuilder<AuditEvent> builder)
    {
        builder.ToTable("AuditEvent");
        builder.HasKey(ae => ae.Id);

        builder.Property(ae => ae.Action).HasMaxLength(100).IsRequired();
        builder.Property(ae => ae.CorrelationId).HasMaxLength(100).IsRequired();
        builder.Property(ae => ae.TargetId).HasMaxLength(100).IsRequired();
        builder.Property(ae => ae.TargetType).HasMaxLength(100).IsRequired();
        builder.Property(ae => ae.Details).HasMaxLength(2000);

        builder.HasOne(ae => ae.ActorUser)
            .WithMany()
            .HasForeignKey(ae => ae.ActorUserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
