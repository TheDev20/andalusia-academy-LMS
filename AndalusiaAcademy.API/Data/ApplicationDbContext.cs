using Microsoft.EntityFrameworkCore;
using AndalusiaAcademy.API.Models.Identity;
using AndalusiaAcademy.API.Models.Catalog;
using AndalusiaAcademy.API.Models.Admissions;
using AndalusiaAcademy.API.Models.Payments;
using AndalusiaAcademy.API.Models.Capacity;
using AndalusiaAcademy.API.Models.Learning;
using AndalusiaAcademy.API.Models.Content;
using AndalusiaAcademy.API.Models.Compensation;
using AndalusiaAcademy.API.Models.Reliability;
using CatalogProgram = AndalusiaAcademy.API.Models.Catalog.Program;

namespace AndalusiaAcademy.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // 1. Identity & Auth
    public DbSet<AppUser> AppUsers => Set<AppUser>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<UserRole> UserRoles => Set<UserRole>();
    public DbSet<Permission> Permissions => Set<Permission>();
    public DbSet<RolePermission> RolePermissions => Set<RolePermission>();
    public DbSet<InstructorProfile> InstructorProfiles => Set<InstructorProfile>();
    public DbSet<TermsVersion> TermsVersions => Set<TermsVersion>();
    public DbSet<TermsAcceptance> TermsAcceptances => Set<TermsAcceptance>();
    public DbSet<PasswordResetToken> PasswordResetTokens => Set<PasswordResetToken>();

    // 2. Catalog & Discovery
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<CatalogProgram> Programs => Set<CatalogProgram>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<CourseCategory> CourseCategories => Set<CourseCategory>();
    public DbSet<ProgramCategory> ProgramCategories => Set<ProgramCategory>();
    public DbSet<ProgramCourse> ProgramCourses => Set<ProgramCourse>();
    public DbSet<CareerPath> CareerPaths => Set<CareerPath>();
    public DbSet<CareerPathCourse> CareerPathCourses => Set<CareerPathCourse>();
    public DbSet<CareerPathProgram> CareerPathPrograms => Set<CareerPathProgram>();
    public DbSet<Offering> Offerings => Set<Offering>();
    public DbSet<ProgramOfferingCourse> ProgramOfferingCourses => Set<ProgramOfferingCourse>();

    // 3. Admissions & Enrollment
    public DbSet<Application> Applications => Set<Application>();
    public DbSet<Enrollment> Enrollments => Set<Enrollment>();
    public DbSet<LearningEnrollment> LearningEnrollments => Set<LearningEnrollment>();

    // 4. Orders & Payments
    public DbSet<SalesOrder> SalesOrders => Set<SalesOrder>();
    public DbSet<PaymentAttempt> PaymentAttempts => Set<PaymentAttempt>();
    public DbSet<PaymentAdjustment> PaymentAdjustments => Set<PaymentAdjustment>();
    public DbSet<Refund> Refunds => Set<Refund>();
    public DbSet<ReconciliationCase> ReconciliationCases => Set<ReconciliationCase>();
    public DbSet<WebhookInbox> WebhookInboxes => Set<WebhookInbox>();

    // 5. Capacity
    public DbSet<SeatReservation> SeatReservations => Set<SeatReservation>();
    public DbSet<ReservationItem> ReservationItems => Set<ReservationItem>();

    // 6. Learning Delivery
    public DbSet<Location> Locations => Set<Location>();
    public DbSet<OfferingInstructor> OfferingInstructors => Set<OfferingInstructor>();
    public DbSet<Session> Sessions => Set<Session>();
    public DbSet<Assignment> Assignments => Set<Assignment>();
    public DbSet<Resource> Resources => Set<Resource>();
    public DbSet<Attendance> Attendances => Set<Attendance>();
    public DbSet<AttendanceCorrection> AttendanceCorrections => Set<AttendanceCorrection>();
    public DbSet<Submission> Submissions => Set<Submission>();
    public DbSet<ResourceProgress> ResourceProgresses => Set<ResourceProgress>();

    // 7. Content & Files
    public DbSet<FileAsset> FileAssets => Set<FileAsset>();
    public DbSet<MediaAsset> MediaAssets => Set<MediaAsset>();
    public DbSet<Page> Pages => Set<Page>();
    public DbSet<PageSection> PageSections => Set<PageSection>();
    public DbSet<PageSectionMedia> PageSectionMedias => Set<PageSectionMedia>();
    public DbSet<Partner> Partners => Set<Partner>();
    public DbSet<Testimonial> Testimonials => Set<Testimonial>();
    public DbSet<FAQ> FAQs => Set<FAQ>();
    public DbSet<ResourceAsset> ResourceAssets => Set<ResourceAsset>();
    public DbSet<SubmissionAsset> SubmissionAssets => Set<SubmissionAsset>();

    // 8. Compensation
    public DbSet<InstructorAgreement> InstructorAgreements => Set<InstructorAgreement>();
    public DbSet<EarningEntry> EarningEntries => Set<EarningEntry>();
    public DbSet<Payout> Payouts => Set<Payout>();
    public DbSet<PayoutAllocation> PayoutAllocations => Set<PayoutAllocation>();

    // 9. Communications & Reliability
    public DbSet<Announcement> Announcements => Set<Announcement>();
    public DbSet<NotificationRecipient> NotificationRecipients => Set<NotificationRecipient>();
    public DbSet<DeliveryAttempt> DeliveryAttempts => Set<DeliveryAttempt>();
    public DbSet<OutboxMessage> OutboxMessages => Set<OutboxMessage>();
    public DbSet<JobExecution> JobExecutions => Set<JobExecution>();
    public DbSet<AuditEvent> AuditEvents => Set<AuditEvent>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply all entity configurations discovered in the assembly
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}
