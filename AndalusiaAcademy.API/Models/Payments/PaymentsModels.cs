using AndalusiaAcademy.API.Models.Admissions;
using AndalusiaAcademy.API.Models.Identity;

namespace AndalusiaAcademy.API.Models.Payments;

public class SalesOrder
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid ApplicationId { get; set; }
    public Application Application { get; set; } = null!;

    public decimal AmountDue { get; set; }
    public string Currency { get; set; } = "EGP";
    public string Status { get; set; } = "PendingPayment";
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public byte[] RowVersion { get; set; } = [];

    // Navigation
    public ICollection<PaymentAttempt> PaymentAttempts { get; set; } = new List<PaymentAttempt>();
}

public class PaymentAttempt
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid SalesOrderId { get; set; }
    public SalesOrder SalesOrder { get; set; } = null!;

    public decimal Amount { get; set; }
    public string Currency { get; set; } = "EGP";
    public string Provider { get; set; } = string.Empty;
    public string? ProviderPaymentId { get; set; }
    public string IdempotencyKey { get; set; } = string.Empty;
    public string Status { get; set; } = "Initiated";
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? SettledAt { get; set; }
    public byte[] RowVersion { get; set; } = [];

    // Navigation
    public ICollection<PaymentAdjustment> PaymentAdjustments { get; set; } = new List<PaymentAdjustment>();
    public ICollection<Refund> Refunds { get; set; } = new List<Refund>();
    public ICollection<ReconciliationCase> ReconciliationCases { get; set; } = new List<ReconciliationCase>();
}

public class PaymentAdjustment
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid PaymentAttemptId { get; set; }
    public PaymentAttempt PaymentAttempt { get; set; } = null!;

    public Guid CreatedByUserId { get; set; }
    public AppUser CreatedByUser { get; set; } = null!;

    public decimal Amount { get; set; }
    public string Currency { get; set; } = "EGP";
    public string Reason { get; set; } = string.Empty;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}

public class Refund
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid PaymentAttemptId { get; set; }
    public PaymentAttempt PaymentAttempt { get; set; } = null!;

    public decimal Amount { get; set; }
    public string Currency { get; set; } = "EGP";
    public string Reason { get; set; } = string.Empty;
    public string IdempotencyKey { get; set; } = string.Empty;
    public string? ProviderRefundId { get; set; }
    public string Status { get; set; } = "Initiated";
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public byte[] RowVersion { get; set; } = [];
}

public class ReconciliationCase
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid PaymentAttemptId { get; set; }
    public PaymentAttempt PaymentAttempt { get; set; } = null!;

    public string Reason { get; set; } = string.Empty;
    public string Status { get; set; } = "Open";
    public string? Resolution { get; set; }
    public DateTimeOffset OpenedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? ResolvedAt { get; set; }
    public byte[] RowVersion { get; set; } = [];
}

public class WebhookInbox
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Provider { get; set; } = string.Empty;
    public string ProviderEventId { get; set; } = string.Empty;
    public string PayloadJson { get; set; } = string.Empty;
    public string Status { get; set; } = "Received";
    public int AttemptCount { get; set; }
    public string? LastError { get; set; }
    public DateTimeOffset ReceivedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? ProcessedAt { get; set; }
    public byte[] RowVersion { get; set; } = [];
}
