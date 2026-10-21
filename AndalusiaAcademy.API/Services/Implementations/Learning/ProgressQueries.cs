using Microsoft.EntityFrameworkCore;
using AndalusiaAcademy.API.Data;
using AndalusiaAcademy.API.ENUMs;

namespace AndalusiaAcademy.API.Services.Implementations.Learning;

/// <summary>
/// Set-based progress counters shared by the learner and instructor views (one round trip per call).
/// </summary>
public sealed class ProgressQueries
{
    private readonly ApplicationDbContext _context;

    public ProgressQueries(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyDictionary<Guid, ProgressInputs>> ForEnrollmentsAsync(
        IReadOnlyCollection<Guid> learningEnrollmentIds, DateTimeOffset now, CancellationToken cancellationToken)
    {
        if (learningEnrollmentIds.Count == 0)
        {
            return new Dictionary<Guid, ProgressInputs>();
        }

        var rows = await _context.LearningEnrollments
            .AsNoTracking()
            .Where(le => learningEnrollmentIds.Contains(le.Id))
            .Select(le => new
            {
                le.Id,
                RequiredResources = _context.Resources.Count(r => r.CourseOfferingId == le.CourseOfferingId && r.Required),
                CompletedRequired = _context.ResourceProgresses.Count(rp =>
                    rp.LearningEnrollmentId == le.Id && rp.Resource.Required),
                SessionsHeld = _context.Sessions.Count(s =>
                    s.CourseOfferingId == le.CourseOfferingId && s.Status != SessionStatuses.Cancelled && s.EndsAt <= now),
                SessionsAttended = _context.Attendances.Count(a =>
                    a.LearningEnrollmentId == le.Id && a.Session.Status != SessionStatuses.Cancelled
                    && (a.Status == AttendanceStatuses.Present || a.Status == AttendanceStatuses.Late)),
                Assignments = _context.Assignments.Count(a =>
                    a.CourseOfferingId == le.CourseOfferingId && a.Status != AssignmentStatuses.Draft),
                Submitted = _context.Submissions
                    .Where(s => s.LearningEnrollmentId == le.Id && s.Assignment.Status != AssignmentStatuses.Draft)
                    .Select(s => s.AssignmentId)
                    .Distinct()
                    .Count()
            })
            .ToListAsync(cancellationToken);

        return rows.ToDictionary(
            r => r.Id,
            r => new ProgressInputs(r.RequiredResources, r.CompletedRequired, r.SessionsHeld, r.SessionsAttended, r.Assignments, r.Submitted));
    }
}
