namespace AndalusiaAcademy.API.ENUMs;

// Lifecycle states are persisted as strings (nvarchar(24)); these constants are the allowed values.

public static class PublicationStatuses
{
    public const string Draft = "Draft";
    public const string Published = "Published";
    public const string Archived = "Archived";

    public static readonly IReadOnlyList<string> All = [Draft, Published, Archived];
}

public static class OfferingStatuses
{
    public const string Planned = "Planned";
    public const string Published = "Published";
    public const string Closed = "Closed";
    public const string Cancelled = "Cancelled";

    public static readonly IReadOnlyList<string> All = [Planned, Published, Closed, Cancelled];
}

public static class ApplicationStatuses
{
    /// <summary>Seat held, awaiting payment.</summary>
    public const string Submitted = "Submitted";
    /// <summary>Payment settled and enrollment fulfilled.</summary>
    public const string Accepted = "Accepted";
    public const string Rejected = "Rejected";
    public const string Cancelled = "Cancelled";
    public const string Expired = "Expired";
}

public static class ReservationStatuses
{
    public const string Held = "Held";
    public const string Converted = "Converted";
    public const string Released = "Released";
}

public static class OrderStatuses
{
    public const string PendingPayment = "PendingPayment";
    public const string Paid = "Paid";
    public const string Cancelled = "Cancelled";
}

public static class PaymentAttemptStatuses
{
    public const string Initiated = "Initiated";
    public const string Succeeded = "Succeeded";
    public const string Failed = "Failed";
}

public static class EnrollmentStatuses
{
    public const string Active = "Active";
    public const string Completed = "Completed";
    public const string Withdrawn = "Withdrawn";
}

public static class AttendanceStatuses
{
    public const string Present = "Present";
    public const string Absent = "Absent";
    public const string Late = "Late";
    public const string Excused = "Excused";

    public static readonly IReadOnlyList<string> All = [Present, Absent, Late, Excused];

    /// <summary>Statuses that count towards the attended-sessions ratio.</summary>
    public static bool CountsAsAttended(string status) => status is Present or Late;
}

public static class SessionStatuses
{
    public const string Scheduled = "Scheduled";
    public const string Completed = "Completed";
    public const string Cancelled = "Cancelled";

    public static readonly IReadOnlyList<string> All = [Scheduled, Completed, Cancelled];
}

public static class AssignmentStatuses
{
    public const string Draft = "Draft";
    public const string Published = "Published";
    public const string Closed = "Closed";

    public static readonly IReadOnlyList<string> All = [Draft, Published, Closed];
}

public static class OfferingKinds
{
    public const string Course = "Course";
    public const string Program = "Program";
}
