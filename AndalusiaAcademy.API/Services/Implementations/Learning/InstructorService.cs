using Microsoft.EntityFrameworkCore;
using AndalusiaAcademy.API.Common.Security;
using AndalusiaAcademy.API.Data;
using AndalusiaAcademy.API.DTOs.Learning;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.API.Exceptions;
using AndalusiaAcademy.API.Models.Admissions;
using AndalusiaAcademy.API.Models.Catalog;
using AndalusiaAcademy.API.Models.Learning;
using AndalusiaAcademy.API.Services.Interfaces.Learning;

namespace AndalusiaAcademy.API.Services.Implementations.Learning;

public sealed class InstructorService : IInstructorService
{
    private readonly ApplicationDbContext _context;
    private readonly ICurrentUser _currentUser;
    private readonly ProgressQueries _progress;
    private readonly TimeProvider _clock;

    public InstructorService(ApplicationDbContext context, ICurrentUser currentUser, ProgressQueries progress, TimeProvider clock)
    {
        _context = context;
        _currentUser = currentUser;
        _progress = progress;
        _clock = clock;
    }

    private bool IsAdmin => _currentUser.IsInRole(AppRoles.Admin);

    public async Task<IReadOnlyList<CohortDto>> GetCohortsAsync(CancellationToken cancellationToken = default)
    {
        var userId = _currentUser.UserId;
        var query = _context.Offerings.AsNoTracking().Where(o => o.Kind == OfferingKinds.Course);
        if (!IsAdmin)
        {
            query = query.Where(o => _context.OfferingInstructors.Any(oi => oi.OfferingId == o.Id && oi.InstructorId == userId));
        }

        return await ProjectCohorts(query.OrderBy(o => o.StartsAt)).ToListAsync(cancellationToken);
    }

    public async Task<CohortDetailDto> GetCohortAsync(Guid offeringId, CancellationToken cancellationToken = default)
    {
        await EnsureCanManageAsync(offeringId, cancellationToken);

        var cohort = await GetCohortAsyncCore(offeringId, cancellationToken);

        var sessions = await _context.Sessions
            .AsNoTracking()
            .Where(s => s.CourseOfferingId == offeringId)
            .OrderBy(s => s.StartsAt)
            .Select(s => new InstructorSessionDto(
                s.Id, s.Title, s.StartsAt, s.EndsAt, s.Status,
                s.Location != null ? s.Location.Name : null,
                s.Attendances.Count))
            .ToListAsync(cancellationToken);

        var assignments = await AssignmentsQuery()
            .Where(a => a.CourseOfferingId == offeringId)
            .OrderBy(a => a.DueAt)
            .Select(ToAssignmentDto)
            .ToListAsync(cancellationToken);

        var roster = await RosterQuery(offeringId)
            .Select(le => new RosterEntryDto(
                le.Id, le.LearnerId, le.Learner.FirstName + " " + le.Learner.LastName, le.Learner.Email, le.Status))
            .ToListAsync(cancellationToken);

        return new CohortDetailDto(cohort, sessions, assignments, roster);
    }

    public async Task<SessionAttendanceDto> GetAttendanceAsync(Guid sessionId, CancellationToken cancellationToken = default)
    {
        var session = await FindSessionAsync(sessionId, cancellationToken);
        await EnsureCanManageAsync(session.CourseOfferingId, cancellationToken);
        return await BuildAttendanceAsync(session, cancellationToken);
    }

    public async Task<SessionAttendanceDto> RecordAttendanceAsync(Guid sessionId, RecordAttendanceRequest request, CancellationToken cancellationToken = default)
    {
        var session = await FindSessionAsync(sessionId, cancellationToken);
        await EnsureCanManageAsync(session.CourseOfferingId, cancellationToken);

        if (session.Status == SessionStatuses.Cancelled)
        {
            throw new BusinessRuleException("Attendance cannot be recorded for a cancelled session.");
        }

        if (session.StartsAt > _clock.GetUtcNow())
        {
            throw new BusinessRuleException("Attendance can only be recorded once the session has started.");
        }

        var requestedIds = request.Records.Select(r => r.LearningEnrollmentId).ToList();
        if (requestedIds.Distinct().Count() != requestedIds.Count)
        {
            throw new BusinessRuleException("Each learner may appear only once per attendance submission.");
        }

        var rosterIds = await RosterQuery(session.CourseOfferingId).Select(le => le.Id).ToListAsync(cancellationToken);
        var unknown = requestedIds.Except(rosterIds).ToList();
        if (unknown.Count > 0)
        {
            throw new BusinessRuleException("One or more learners are not actively enrolled in this cohort.");
        }

        var existing = await _context.Attendances
            .Where(a => a.SessionId == sessionId && requestedIds.Contains(a.LearningEnrollmentId))
            .ToDictionaryAsync(a => a.LearningEnrollmentId, cancellationToken);

        var actorId = _currentUser.UserId;
        var now = _clock.GetUtcNow();

        foreach (var entry in request.Records)
        {
            if (existing.TryGetValue(entry.LearningEnrollmentId, out var attendance))
            {
                if (attendance.Status == entry.Status)
                {
                    continue;
                }

                // Changes to recorded attendance are audited, never silently overwritten.
                _context.AttendanceCorrections.Add(new AttendanceCorrection
                {
                    SessionId = sessionId,
                    LearningEnrollmentId = entry.LearningEnrollmentId,
                    ActorUserId = actorId,
                    OldStatus = attendance.Status,
                    NewStatus = entry.Status,
                    Reason = string.IsNullOrWhiteSpace(entry.CorrectionReason) ? "Corrected by instructor" : entry.CorrectionReason.Trim(),
                    CorrectedAt = now
                });
                attendance.Status = entry.Status;
                attendance.RecordedByUserId = actorId;
                attendance.RecordedAt = now;
            }
            else
            {
                _context.Attendances.Add(new Attendance
                {
                    SessionId = sessionId,
                    LearningEnrollmentId = entry.LearningEnrollmentId,
                    CourseOfferingId = session.CourseOfferingId,
                    RecordedByUserId = actorId,
                    RecordedAt = now,
                    Status = entry.Status
                });
            }
        }

        await _context.SaveChangesAsync(cancellationToken);
        return await BuildAttendanceAsync(session, cancellationToken);
    }

    public async Task<InstructorAssignmentDto> CreateAssignmentAsync(Guid offeringId, UpsertAssignmentRequest request, CancellationToken cancellationToken = default)
    {
        await EnsureCanManageAsync(offeringId, cancellationToken);
        var offering = await _context.Offerings.AsNoTracking()
            .Where(o => o.Id == offeringId)
            .Select(o => new { o.Kind })
            .FirstAsync(cancellationToken);
        if (offering.Kind != OfferingKinds.Course)
        {
            throw new BusinessRuleException("Assignments belong to course offerings.");
        }

        var assignment = new Assignment
        {
            CourseOfferingId = offeringId,
            CourseKind = OfferingKinds.Course
        };
        Apply(assignment, request);
        _context.Assignments.Add(assignment);
        await _context.SaveChangesAsync(cancellationToken);

        return await AssignmentsQuery().Where(a => a.Id == assignment.Id).Select(ToAssignmentDto).FirstAsync(cancellationToken);
    }

    public async Task<InstructorAssignmentDto> UpdateAssignmentAsync(Guid assignmentId, UpsertAssignmentRequest request, CancellationToken cancellationToken = default)
    {
        var assignment = await _context.Assignments.FirstOrDefaultAsync(a => a.Id == assignmentId, cancellationToken)
            ?? throw new NotFoundException("Assignment not found.");
        await EnsureCanManageAsync(assignment.CourseOfferingId, cancellationToken);

        if (request.MaxScore < assignment.MaxScore &&
            await _context.Submissions.AnyAsync(s => s.AssignmentId == assignmentId && s.Score > request.MaxScore, cancellationToken))
        {
            throw new BusinessRuleException("MaxScore cannot be lowered below an already awarded score.");
        }

        Apply(assignment, request);
        await _context.SaveChangesAsync(cancellationToken);

        return await AssignmentsQuery().Where(a => a.Id == assignment.Id).Select(ToAssignmentDto).FirstAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<SubmissionForGradingDto>> GetSubmissionsAsync(Guid assignmentId, CancellationToken cancellationToken = default)
    {
        var assignment = await _context.Assignments.AsNoTracking().FirstOrDefaultAsync(a => a.Id == assignmentId, cancellationToken)
            ?? throw new NotFoundException("Assignment not found.");
        await EnsureCanManageAsync(assignment.CourseOfferingId, cancellationToken);

        return await _context.Submissions
            .AsNoTracking()
            .Where(s => s.AssignmentId == assignmentId)
            .OrderBy(s => s.SubmittedAt)
            .Select(s => new SubmissionForGradingDto(
                s.Id, s.LearningEnrollmentId,
                s.LearningEnrollment.Learner.FirstName + " " + s.LearningEnrollment.Learner.LastName,
                s.AttemptNumber, s.Body, s.SubmittedAt, s.Score, s.GradedAt))
            .ToListAsync(cancellationToken);
    }

    public async Task<SubmissionForGradingDto> GradeSubmissionAsync(Guid submissionId, GradeSubmissionRequest request, CancellationToken cancellationToken = default)
    {
        var submission = await _context.Submissions
            .Include(s => s.Assignment)
            .Include(s => s.LearningEnrollment).ThenInclude(le => le.Learner)
            .FirstOrDefaultAsync(s => s.Id == submissionId, cancellationToken)
            ?? throw new NotFoundException("Submission not found.");
        await EnsureCanManageAsync(submission.CourseOfferingId, cancellationToken);

        if (request.Score > submission.Assignment.MaxScore)
        {
            throw new BusinessRuleException($"Score cannot exceed the assignment maximum of {submission.Assignment.MaxScore}.");
        }

        submission.Score = request.Score;
        submission.GradedAt = _clock.GetUtcNow();
        submission.GradedByUserId = _currentUser.UserId;
        await _context.SaveChangesAsync(cancellationToken);

        var learner = submission.LearningEnrollment.Learner;
        return new SubmissionForGradingDto(submission.Id, submission.LearningEnrollmentId, $"{learner.FirstName} {learner.LastName}",
            submission.AttemptNumber, submission.Body, submission.SubmittedAt, submission.Score, submission.GradedAt);
    }

    public async Task<IReadOnlyList<LearnerProgressDto>> GetProgressAsync(Guid offeringId, CancellationToken cancellationToken = default)
    {
        await EnsureCanManageAsync(offeringId, cancellationToken);

        var roster = await RosterQuery(offeringId)
            .Select(le => new { le.Id, le.LearnerId, Name = le.Learner.FirstName + " " + le.Learner.LastName, le.Learner.Email })
            .ToListAsync(cancellationToken);

        var progress = await _progress.ForEnrollmentsAsync(roster.Select(r => r.Id).ToList(), _clock.GetUtcNow(), cancellationToken);

        return roster
            .Select(r => new LearnerProgressDto(r.Id, r.LearnerId, r.Name, r.Email, ProgressCalculator.Calculate(progress[r.Id])))
            .ToList();
    }

    /// <summary>
    /// Resource-level authorization: the caller must be assigned to the offering (or be an Admin).
    /// </summary>
    private async Task EnsureCanManageAsync(Guid offeringId, CancellationToken cancellationToken)
    {
        if (!await _context.Offerings.AnyAsync(o => o.Id == offeringId, cancellationToken))
        {
            throw new NotFoundException("Cohort not found.");
        }

        if (IsAdmin)
        {
            return;
        }

        var userId = _currentUser.UserId;
        var assigned = await _context.OfferingInstructors
            .AnyAsync(oi => oi.OfferingId == offeringId && oi.InstructorId == userId, cancellationToken);
        if (!assigned)
        {
            throw new ForbiddenException("You are not assigned to this cohort.");
        }
    }

    private async Task<CohortDto> GetCohortAsyncCore(Guid offeringId, CancellationToken cancellationToken) =>
        await ProjectCohorts(_context.Offerings.AsNoTracking().Where(o => o.Id == offeringId && o.Kind == OfferingKinds.Course))
            .FirstOrDefaultAsync(cancellationToken)
        ?? throw new NotFoundException("Cohort not found.");

    private IQueryable<CohortDto> ProjectCohorts(IQueryable<Offering> offerings) =>
        offerings
            .Select(o => new CohortDto(
                o.Id,
                o.CourseId!.Value,
                o.Course!.Title,
                o.StartsAt,
                o.EndsAt,
                o.Status,
                _context.LearningEnrollments.Count(le => le.CourseOfferingId == o.Id && le.Status == EnrollmentStatuses.Active),
                _context.Sessions.Count(s => s.CourseOfferingId == o.Id),
                _context.Assignments.Count(a => a.CourseOfferingId == o.Id)));

    private IQueryable<LearningEnrollment> RosterQuery(Guid offeringId) =>
        _context.LearningEnrollments
            .AsNoTracking()
            .Where(le => le.CourseOfferingId == offeringId && le.Status == EnrollmentStatuses.Active)
            .OrderBy(le => le.Learner.LastName).ThenBy(le => le.Learner.FirstName);

    private IQueryable<Assignment> AssignmentsQuery() => _context.Assignments.AsNoTracking();

    private static readonly System.Linq.Expressions.Expression<Func<Assignment, InstructorAssignmentDto>> ToAssignmentDto =
        a => new InstructorAssignmentDto(
            a.Id, a.Title, a.Instructions, a.MaxScore, a.DueAt, a.Status,
            a.Submissions.Count,
            a.Submissions.Count(s => s.GradedAt == null));

    private static void Apply(Assignment assignment, UpsertAssignmentRequest request)
    {
        assignment.Title = request.Title.Trim();
        assignment.Instructions = request.Instructions.Trim();
        assignment.MaxScore = request.MaxScore;
        assignment.DueAt = request.DueAt;
        assignment.Status = request.Status;
    }

    private async Task<Session> FindSessionAsync(Guid sessionId, CancellationToken cancellationToken) =>
        await _context.Sessions.AsNoTracking().FirstOrDefaultAsync(s => s.Id == sessionId, cancellationToken)
        ?? throw new NotFoundException("Session not found.");

    private async Task<SessionAttendanceDto> BuildAttendanceAsync(Session session, CancellationToken cancellationToken)
    {
        var records = await RosterQuery(session.CourseOfferingId)
            .Select(le => new AttendanceRecordDto(
                le.Id,
                le.LearnerId,
                le.Learner.FirstName + " " + le.Learner.LastName,
                _context.Attendances.Where(a => a.SessionId == session.Id && a.LearningEnrollmentId == le.Id).Select(a => a.Status).FirstOrDefault(),
                _context.Attendances.Where(a => a.SessionId == session.Id && a.LearningEnrollmentId == le.Id).Select(a => (DateTimeOffset?)a.RecordedAt).FirstOrDefault()))
            .ToListAsync(cancellationToken);

        return new SessionAttendanceDto(session.Id, session.CourseOfferingId, session.Title, session.StartsAt, records);
    }
}
