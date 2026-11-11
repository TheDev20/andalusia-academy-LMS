using Microsoft.EntityFrameworkCore;
using AndalusiaAcademy.API.Data;
using AndalusiaAcademy.API.DTOs.Common;
using AndalusiaAcademy.API.DTOs.Learning;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.API.Exceptions;
using AndalusiaAcademy.API.Models.Admissions;
using AndalusiaAcademy.API.Models.Content;
using AndalusiaAcademy.API.Models.Learning;
using AndalusiaAcademy.API.Services.Interfaces.Learning;
using AndalusiaAcademy.API.Services.Interfaces.Storage;

namespace AndalusiaAcademy.API.Services.Implementations.Learning;

public sealed class LearnerLearningService : ILearnerLearningService
{
    private readonly ApplicationDbContext _context;
    private readonly ProgressQueries _progress;
    private readonly TimeProvider _clock;
    private readonly IFileAssetService _files;

    public LearnerLearningService(ApplicationDbContext context, ProgressQueries progress, TimeProvider clock, IFileAssetService files)
    {
        _context = context;
        _progress = progress;
        _clock = clock;
        _files = files;
    }

    public async Task<IReadOnlyList<MyCourseDto>> GetMyCoursesAsync(Guid learnerId, CancellationToken cancellationToken = default)
    {
        var now = _clock.GetUtcNow();
        var rows = await ActiveEnrollments(learnerId)
            .OrderBy(le => le.CourseOffering.StartsAt)
            .Select(le => new
            {
                le.Id,
                le.CourseOfferingId,
                CourseId = le.CourseOffering.CourseId!.Value,
                le.CourseOffering.Course!.Title,
                le.CourseOffering.Course.Slug,
                le.CourseOffering.Course.ImageUrl,
                Category = le.CourseOffering.Course.CourseCategories
                    .OrderBy(cc => cc.Sequence)
                    .Select(cc => cc.Category.Name)
                    .FirstOrDefault(),
                le.CourseOffering.StartsAt,
                le.CourseOffering.EndsAt,
                le.Status,
                NextSessionAt = _context.Sessions
                    .Where(s => s.CourseOfferingId == le.CourseOfferingId && s.Status == SessionStatuses.Scheduled && s.StartsAt > now)
                    .OrderBy(s => s.StartsAt)
                    .Select(s => (DateTimeOffset?)s.StartsAt)
                    .FirstOrDefault()
            })
            .ToListAsync(cancellationToken);

        var progress = await _progress.ForEnrollmentsAsync(rows.Select(r => r.Id).ToList(), now, cancellationToken);

        return rows.Select(r => new MyCourseDto(
                r.Id, r.CourseOfferingId, r.CourseId, r.Title, r.Slug, r.ImageUrl, r.Category, r.StartsAt, r.EndsAt, r.Status, r.NextSessionAt,
                ProgressCalculator.Calculate(progress[r.Id])))
            .ToList();
    }

    public async Task<CourseLearningDto> GetCourseAsync(Guid learnerId, Guid courseOfferingId, CancellationToken cancellationToken = default)
    {
        var now = _clock.GetUtcNow();
        var enrollment = await RequireEnrollmentAsync(learnerId, courseOfferingId, cancellationToken);

        var header = await _context.Offerings
            .AsNoTracking()
            .Where(o => o.Id == courseOfferingId)
            .Select(o => new { o.Course!.Title, o.Course.Description, o.StartsAt, o.EndsAt, o.TimeZoneId })
            .FirstAsync(cancellationToken);

        var instructors = await _context.OfferingInstructors
            .AsNoTracking()
            .Where(oi => oi.OfferingId == courseOfferingId)
            .Select(oi => oi.Instructor.User.FirstName + " " + oi.Instructor.User.LastName)
            .OrderBy(n => n)
            .ToListAsync(cancellationToken);

        var sessions = await _context.Sessions
            .AsNoTracking()
            .Where(s => s.CourseOfferingId == courseOfferingId)
            .OrderBy(s => s.StartsAt)
            .Select(s => new LearnerSessionDto(
                s.Id, s.Title, s.StartsAt, s.EndsAt, s.Status,
                s.Location == null ? null : new LocationDto(s.Location.Id, s.Location.Name, s.Location.Address, s.Location.MeetingUrl),
                s.Attendances.Where(a => a.LearningEnrollmentId == enrollment.Id).Select(a => a.Status).FirstOrDefault()))
            .ToListAsync(cancellationToken);

        var resources = await _context.Resources
            .AsNoTracking()
            .Where(r => r.CourseOfferingId == courseOfferingId)
            .OrderBy(r => r.Sequence)
            .Select(r => new LearnerResourceDto(
                r.Id, r.Title, r.Url, r.Required, r.Sequence,
                r.ProgressRecords.Where(p => p.LearningEnrollmentId == enrollment.Id).Select(p => (DateTimeOffset?)p.CompletedAt).FirstOrDefault()))
            .ToListAsync(cancellationToken);

        var assignments = await _context.Assignments
            .AsNoTracking()
            .Where(a => a.CourseOfferingId == courseOfferingId && a.Status != AssignmentStatuses.Draft)
            .OrderBy(a => a.DueAt)
            .Select(a => new LearnerAssignmentDto(
                a.Id, a.Title, a.Instructions, a.MaxScore, a.DueAt, a.Status,
                a.Submissions
                    .Where(s => s.LearningEnrollmentId == enrollment.Id)
                    .OrderByDescending(s => s.AttemptNumber)
                    .Select(s => new SubmissionDto(s.Id, s.AssignmentId, s.AttemptNumber, s.Body, s.Score, s.SubmittedAt, s.GradedAt,
                        _context.SubmissionAssets
                            .Where(sa => sa.SubmissionId == s.Id)
                            .OrderBy(sa => sa.FileAsset.UploadedAt).ThenBy(sa => sa.FileAsset.OriginalName)
                            .Select(sa => new FileDto(sa.FileAsset.Id, sa.FileAsset.OriginalName, sa.FileAsset.MediaType, sa.FileAsset.SizeBytes))
                            .ToList()))
                    .FirstOrDefault()))
            .ToListAsync(cancellationToken);

        var progress = await _progress.ForEnrollmentsAsync([enrollment.Id], now, cancellationToken);

        return new CourseLearningDto(
            enrollment.Id, courseOfferingId, header.Title, header.Description, header.StartsAt, header.EndsAt, header.TimeZoneId,
            instructors, sessions, resources, assignments, ProgressCalculator.Calculate(progress[enrollment.Id]));
    }

    public async Task<LearnerResourceDto> CompleteResourceAsync(Guid learnerId, Guid resourceId, CancellationToken cancellationToken = default)
    {
        var resource = await _context.Resources.AsNoTracking().FirstOrDefaultAsync(r => r.Id == resourceId, cancellationToken)
            ?? throw new NotFoundException("Resource not found.");
        var enrollment = await RequireEnrollmentAsync(learnerId, resource.CourseOfferingId, cancellationToken);

        var progress = await _context.ResourceProgresses
            .FirstOrDefaultAsync(p => p.ResourceId == resourceId && p.LearningEnrollmentId == enrollment.Id, cancellationToken);

        if (progress is null)
        {
            progress = new ResourceProgress
            {
                ResourceId = resourceId,
                LearningEnrollmentId = enrollment.Id,
                CourseOfferingId = resource.CourseOfferingId,
                CompletedAt = _clock.GetUtcNow()
            };
            _context.ResourceProgresses.Add(progress);
            // Composite PK makes a concurrent duplicate completion a 409 rather than a double count.
            await _context.SaveChangesAsync(cancellationToken);
        }

        return new LearnerResourceDto(resource.Id, resource.Title, resource.Url, resource.Required, resource.Sequence, progress.CompletedAt);
    }

    public Task<SubmissionDto> SubmitAssignmentAsync(
        Guid learnerId, Guid assignmentId, SubmitAssignmentRequest request, CancellationToken cancellationToken = default) =>
        SubmitAssignmentAsync(learnerId, assignmentId, request.Body, [], cancellationToken);

    public async Task<SubmissionDto> SubmitAssignmentAsync(
        Guid learnerId, Guid assignmentId, string? body, IReadOnlyList<IncomingFile> files, CancellationToken cancellationToken = default)
    {
        var text = string.IsNullOrWhiteSpace(body) ? null : body.Trim();
        if (text is null && files.Count == 0)
        {
            throw new BusinessRuleException("Write an answer or attach at least one file.");
        }

        var assignment = await _context.Assignments.AsNoTracking().FirstOrDefaultAsync(a => a.Id == assignmentId, cancellationToken)
            ?? throw new NotFoundException("Assignment not found.");
        var enrollment = await RequireEnrollmentAsync(learnerId, assignment.CourseOfferingId, cancellationToken);

        if (assignment.Status != AssignmentStatuses.Published)
        {
            throw new BusinessRuleException("This assignment is not accepting submissions.");
        }

        var lastAttempt = await _context.Submissions
            .Where(s => s.AssignmentId == assignmentId && s.LearningEnrollmentId == enrollment.Id)
            .MaxAsync(s => (int?)s.AttemptNumber, cancellationToken) ?? 0;

        var assets = await _files.StoreAsync(files, learnerId, cancellationToken);

        var submission = new Submission
        {
            AssignmentId = assignmentId,
            LearningEnrollmentId = enrollment.Id,
            CourseOfferingId = assignment.CourseOfferingId,
            AttemptNumber = lastAttempt + 1,
            Body = text,
            SubmittedAt = _clock.GetUtcNow()
        };
        _context.Submissions.Add(submission);
        foreach (var asset in assets)
        {
            _context.SubmissionAssets.Add(new SubmissionAsset { Submission = submission, FileAsset = asset });
        }

        try
        {
            // Unique (AssignmentId, LearningEnrollmentId, AttemptNumber) rejects racing double-submits with 409.
            await _context.SaveChangesAsync(cancellationToken);
        }
        catch
        {
            await _files.DiscardAsync(assets, CancellationToken.None);
            throw;
        }

        return new SubmissionDto(submission.Id, submission.AssignmentId, submission.AttemptNumber, submission.Body,
            submission.Score, submission.SubmittedAt, submission.GradedAt,
            assets.Select(a => new FileDto(a.Id, a.OriginalName, a.MediaType, a.SizeBytes)).ToList());
    }

    private IQueryable<LearningEnrollment> ActiveEnrollments(Guid learnerId) =>
        _context.LearningEnrollments
            .AsNoTracking()
            .Where(le => le.LearnerId == learnerId
                && le.Status == EnrollmentStatuses.Active
                && le.Enrollment.Status == EnrollmentStatuses.Active);

    /// <summary>Learners only see course offerings they are actively enrolled in; anything else is a 403.</summary>
    private async Task<LearningEnrollment> RequireEnrollmentAsync(Guid learnerId, Guid courseOfferingId, CancellationToken cancellationToken) =>
        await ActiveEnrollments(learnerId).FirstOrDefaultAsync(le => le.CourseOfferingId == courseOfferingId, cancellationToken)
        ?? throw new ForbiddenException("You are not enrolled in this course.");
}
