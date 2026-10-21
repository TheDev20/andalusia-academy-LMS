using AndalusiaAcademy.API.Models.Admissions;
using AndalusiaAcademy.API.Models.Catalog;
using AndalusiaAcademy.API.Models.Identity;

namespace AndalusiaAcademy.API.Models.Learning;

public class Location
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? MeetingUrl { get; set; }

    // Navigation
    public ICollection<Session> Sessions { get; set; } = new List<Session>();
}

public class OfferingInstructor
{
    public Guid OfferingId { get; set; }
    public Offering Offering { get; set; } = null!;

    public Guid InstructorId { get; set; }
    public InstructorProfile Instructor { get; set; } = null!;
}

public class Session
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid CourseOfferingId { get; set; }
    public Offering CourseOffering { get; set; } = null!;
    public string CourseKind { get; set; } = "Course";

    public Guid? LocationId { get; set; }
    public Location? Location { get; set; }

    public string Title { get; set; } = string.Empty;
    public DateTimeOffset StartsAt { get; set; }
    public DateTimeOffset EndsAt { get; set; }
    public string Status { get; set; } = "Scheduled";
    public byte[] RowVersion { get; set; } = [];

    // Navigation
    public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
}

public class Assignment
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid CourseOfferingId { get; set; }
    public Offering CourseOffering { get; set; } = null!;
    public string CourseKind { get; set; } = "Course";

    public string Title { get; set; } = string.Empty;
    public string Instructions { get; set; } = string.Empty;
    public decimal MaxScore { get; set; } = 100m;
    public DateTimeOffset? DueAt { get; set; }
    public string Status { get; set; } = "Published";
    public byte[] RowVersion { get; set; } = [];

    // Navigation
    public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
}

public class Resource
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid CourseOfferingId { get; set; }
    public Offering CourseOffering { get; set; } = null!;
    public string CourseKind { get; set; } = "Course";

    public string Title { get; set; } = string.Empty;
    public string? Url { get; set; }
    public bool Required { get; set; } = true;
    public int Sequence { get; set; }
    public byte[] RowVersion { get; set; } = [];

    // Navigation
    public ICollection<ResourceProgress> ProgressRecords { get; set; } = new List<ResourceProgress>();
}

public class Attendance
{
    public Guid SessionId { get; set; }
    public Session Session { get; set; } = null!;

    public Guid LearningEnrollmentId { get; set; }
    public LearningEnrollment LearningEnrollment { get; set; } = null!;

    public Guid CourseOfferingId { get; set; }

    public Guid RecordedByUserId { get; set; }
    public AppUser RecordedByUser { get; set; } = null!;

    public DateTimeOffset RecordedAt { get; set; } = DateTimeOffset.UtcNow;
    public string Status { get; set; } = "Present";
    public byte[] RowVersion { get; set; } = [];

    // Navigation
    public ICollection<AttendanceCorrection> Corrections { get; set; } = new List<AttendanceCorrection>();
}

public class AttendanceCorrection
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid SessionId { get; set; }
    public Guid LearningEnrollmentId { get; set; }
    public Attendance Attendance { get; set; } = null!;

    public Guid ActorUserId { get; set; }
    public AppUser ActorUser { get; set; } = null!;

    public string OldStatus { get; set; } = string.Empty;
    public string NewStatus { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
    public DateTimeOffset CorrectedAt { get; set; } = DateTimeOffset.UtcNow;
}

public class Submission
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid AssignmentId { get; set; }
    public Assignment Assignment { get; set; } = null!;

    public Guid LearningEnrollmentId { get; set; }
    public LearningEnrollment LearningEnrollment { get; set; } = null!;

    public Guid CourseOfferingId { get; set; }

    public int AttemptNumber { get; set; } = 1;
    public string? Body { get; set; }
    public decimal? Score { get; set; }
    public DateTimeOffset SubmittedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? GradedAt { get; set; }

    public Guid? GradedByUserId { get; set; }
    public AppUser? GradedByUser { get; set; }

    public byte[] RowVersion { get; set; } = [];
}

public class ResourceProgress
{
    public Guid ResourceId { get; set; }
    public Resource Resource { get; set; } = null!;

    public Guid LearningEnrollmentId { get; set; }
    public LearningEnrollment LearningEnrollment { get; set; } = null!;

    public Guid CourseOfferingId { get; set; }

    public DateTimeOffset CompletedAt { get; set; } = DateTimeOffset.UtcNow;
}
