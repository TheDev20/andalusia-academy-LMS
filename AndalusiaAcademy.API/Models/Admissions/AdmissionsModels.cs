using AndalusiaAcademy.API.Models.Identity;
using AndalusiaAcademy.API.Models.Catalog;

namespace AndalusiaAcademy.API.Models.Admissions;

public class Application
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid LearnerId { get; set; }
    public AppUser Learner { get; set; } = null!;

    public Guid OfferingId { get; set; }
    public Offering Offering { get; set; } = null!;

    public string Status { get; set; } = "Submitted";
    public DateTimeOffset? SubmittedAt { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public byte[] RowVersion { get; set; } = [];

    // Navigation
    public Enrollment? Enrollment { get; set; }
}

public class Enrollment
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid ApplicationId { get; set; }
    public Application Application { get; set; } = null!;

    public Guid LearnerId { get; set; }
    public AppUser Learner { get; set; } = null!;

    public string Status { get; set; } = "Active";
    public DateTimeOffset EnrolledAt { get; set; } = DateTimeOffset.UtcNow;
    public byte[] RowVersion { get; set; } = [];

    // Navigation
    public ICollection<LearningEnrollment> LearningEnrollments { get; set; } = new List<LearningEnrollment>();
}

public class LearningEnrollment
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid EnrollmentId { get; set; }
    public Enrollment Enrollment { get; set; } = null!;

    public Guid LearnerId { get; set; }
    public AppUser Learner { get; set; } = null!;

    public Guid CourseOfferingId { get; set; }
    public Offering CourseOffering { get; set; } = null!;
    public string CourseKind { get; set; } = "Course";

    public string Status { get; set; } = "Active";
    public DateTimeOffset? CompletedAt { get; set; }
    public byte[] RowVersion { get; set; } = [];
}
