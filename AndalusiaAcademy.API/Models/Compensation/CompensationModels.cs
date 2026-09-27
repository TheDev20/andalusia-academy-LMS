using AndalusiaAcademy.API.Models.Catalog;
using AndalusiaAcademy.API.Models.Identity;
using AndalusiaAcademy.API.Models.Learning;

namespace AndalusiaAcademy.API.Models.Compensation;

public class InstructorAgreement
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid OfferingId { get; set; }
    public Offering Offering { get; set; } = null!;

    public Guid InstructorId { get; set; }
    public InstructorProfile Instructor { get; set; } = null!;

    public int Version { get; set; } = 1;
    public decimal Rate { get; set; }
    public string Currency { get; set; } = "EGP";
    public string Basis { get; set; } = "Hourly";
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? AcceptedAt { get; set; }
    public byte[] RowVersion { get; set; } = [];

    // Navigation
    public ICollection<EarningEntry> EarningEntries { get; set; } = new List<EarningEntry>();
}

public class EarningEntry
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid InstructorAgreementId { get; set; }
    public InstructorAgreement InstructorAgreement { get; set; } = null!;

    public Guid InstructorId { get; set; }
    public InstructorProfile Instructor { get; set; } = null!;

    public string SourceKey { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public decimal Rate { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "EGP";
    public DateTimeOffset EarnedAt { get; set; } = DateTimeOffset.UtcNow;
    public byte[] RowVersion { get; set; } = [];

    // Navigation
    public ICollection<PayoutAllocation> PayoutAllocations { get; set; } = new List<PayoutAllocation>();
}

public class Payout
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid InstructorId { get; set; }
    public InstructorProfile Instructor { get; set; } = null!;

    public decimal Amount { get; set; }
    public string Currency { get; set; } = "EGP";
    public string Provider { get; set; } = string.Empty;
    public string? ProviderPayoutId { get; set; }
    public string IdempotencyKey { get; set; } = string.Empty;
    public string Status { get; set; } = "Initiated";
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? PaidAt { get; set; }
    public byte[] RowVersion { get; set; } = [];

    // Navigation
    public ICollection<PayoutAllocation> PayoutAllocations { get; set; } = new List<PayoutAllocation>();
}

public class PayoutAllocation
{
    public Guid PayoutId { get; set; }
    public Payout Payout { get; set; } = null!;

    public Guid EarningEntryId { get; set; }
    public EarningEntry EarningEntry { get; set; } = null!;

    public Guid InstructorId { get; set; }
    public string Currency { get; set; } = "EGP";
    public decimal Amount { get; set; }
}
