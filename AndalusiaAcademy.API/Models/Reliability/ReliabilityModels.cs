using AndalusiaAcademy.API.Models.Catalog;
using AndalusiaAcademy.API.Models.Identity;

namespace AndalusiaAcademy.API.Models.Reliability;

public class Announcement
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid OfferingId { get; set; }
    public Offering Offering { get; set; } = null!;

    public Guid AuthorUserId { get; set; }
    public AppUser AuthorUser { get; set; } = null!;

    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public DateTimeOffset? PublishedAt { get; set; }

    // Navigation
    public ICollection<NotificationRecipient> NotificationRecipients { get; set; } = new List<NotificationRecipient>();
}

public class NotificationRecipient
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid AnnouncementId { get; set; }
    public Announcement Announcement { get; set; } = null!;

    public Guid UserId { get; set; }
    public AppUser User { get; set; } = null!;

    public string Channel { get; set; } = "Email";
    public string Destination { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending";
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? ReadAt { get; set; }
    public byte[] RowVersion { get; set; } = [];

    // Navigation
    public ICollection<DeliveryAttempt> DeliveryAttempts { get; set; } = new List<DeliveryAttempt>();
}

public class DeliveryAttempt
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid NotificationRecipientId { get; set; }
    public NotificationRecipient NotificationRecipient { get; set; } = null!;

    public int AttemptNumber { get; set; } = 1;
    public string Provider { get; set; } = string.Empty;
    public string? ProviderReference { get; set; }
    public string Status { get; set; } = "Pending";
    public string? Error { get; set; }
    public DateTimeOffset AttemptedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? NextRetryAt { get; set; }
}

public class OutboxMessage
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string DeduplicationKey { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string PayloadJson { get; set; } = "{}";
    public DateTimeOffset AvailableAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? ProcessedAt { get; set; }
    public string? LeaseOwner { get; set; }
    public DateTimeOffset? LeaseExpiresAt { get; set; }
    public int AttemptCount { get; set; }
    public string? LastError { get; set; }
    public byte[] RowVersion { get; set; } = [];

    // Navigation
    public ICollection<JobExecution> JobExecutions { get; set; } = new List<JobExecution>();
}

public class JobExecution
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid OutboxMessageId { get; set; }
    public OutboxMessage OutboxMessage { get; set; } = null!;

    public string WorkerId { get; set; } = string.Empty;
    public int AttemptNumber { get; set; } = 1;
    public string Status { get; set; } = "Started";
    public DateTimeOffset StartedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? FinishedAt { get; set; }
    public string? Error { get; set; }
}

public class AuditEvent
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Action { get; set; } = string.Empty;

    public Guid? ActorUserId { get; set; }
    public AppUser? ActorUser { get; set; }

    public string CorrelationId { get; set; } = string.Empty;
    public string TargetId { get; set; } = string.Empty;
    public string TargetType { get; set; } = string.Empty;
    public DateTimeOffset OccurredAt { get; set; } = DateTimeOffset.UtcNow;
    public string? Details { get; set; }
}
