using Microsoft.EntityFrameworkCore;
using AndalusiaAcademy.API.Data;
using AndalusiaAcademy.API.DTOs.Admissions;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.API.Mapping.Admissions;
using AndalusiaAcademy.API.Models.Admissions;
using AndalusiaAcademy.API.Services.Interfaces.Admissions;

namespace AndalusiaAcademy.API.Services.Implementations.Admissions;

public sealed class EnrollmentService : IEnrollmentService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<EnrollmentService> _logger;

    public EnrollmentService(ApplicationDbContext context, ILogger<EnrollmentService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Enrollment> StageFulfillmentAsync(Application application, DateTimeOffset now, CancellationToken cancellationToken)
    {
        var offering = await _context.Offerings
            .AsNoTracking()
            .Where(o => o.Id == application.OfferingId)
            .Select(o => new { o.Id, o.Kind })
            .FirstAsync(cancellationToken);

        // A course offering yields one learning enrollment; a program offering yields one per scheduled course.
        var courseOfferingIds = offering.Kind == OfferingKinds.Course
            ? [offering.Id]
            : await _context.ProgramOfferingCourses
                .AsNoTracking()
                .Where(poc => poc.ProgramOfferingId == offering.Id)
                .OrderBy(poc => poc.Sequence)
                .Select(poc => poc.CourseOfferingId)
                .ToListAsync(cancellationToken);

        var alreadyActive = await _context.LearningEnrollments
            .AsNoTracking()
            .Where(le => le.LearnerId == application.LearnerId
                && le.Status == EnrollmentStatuses.Active
                && courseOfferingIds.Contains(le.CourseOfferingId))
            .Select(le => le.CourseOfferingId)
            .ToListAsync(cancellationToken);

        var enrollment = new Enrollment
        {
            Application = application,
            ApplicationId = application.Id,
            LearnerId = application.LearnerId,
            Status = EnrollmentStatuses.Active,
            EnrolledAt = now
        };

        foreach (var courseOfferingId in courseOfferingIds.Except(alreadyActive))
        {
            enrollment.LearningEnrollments.Add(new LearningEnrollment
            {
                EnrollmentId = enrollment.Id,
                LearnerId = application.LearnerId,
                CourseOfferingId = courseOfferingId,
                CourseKind = OfferingKinds.Course,
                Status = EnrollmentStatuses.Active
            });
        }

        if (courseOfferingIds.Count == 0)
        {
            _logger.LogWarning("Program offering {OfferingId} has no scheduled course offerings; enrollment {EnrollmentId} has no learning access yet",
                offering.Id, enrollment.Id);
        }

        _context.Enrollments.Add(enrollment);
        return enrollment;
    }

    public async Task<IReadOnlyList<EnrollmentDto>> GetForLearnerAsync(Guid learnerId, CancellationToken cancellationToken = default)
    {
        return await _context.Enrollments
            .AsNoTracking()
            .Where(e => e.LearnerId == learnerId)
            .OrderByDescending(e => e.EnrolledAt)
            .Select(AdmissionsMappings.ToEnrollmentDto())
            .ToListAsync(cancellationToken);
    }
}
