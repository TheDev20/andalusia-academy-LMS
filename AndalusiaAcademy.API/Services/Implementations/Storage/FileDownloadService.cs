using Microsoft.EntityFrameworkCore;
using AndalusiaAcademy.API.Common.Security;
using AndalusiaAcademy.API.Data;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.API.Exceptions;
using AndalusiaAcademy.API.Services.Interfaces.Storage;

namespace AndalusiaAcademy.API.Services.Implementations.Storage;

public sealed class FileDownloadService : IFileDownloadService
{
    private readonly ApplicationDbContext _context;
    private readonly IFileStorage _storage;
    private readonly ICurrentUser _currentUser;
    private readonly ILogger<FileDownloadService> _logger;

    public FileDownloadService(ApplicationDbContext context, IFileStorage storage, ICurrentUser currentUser, ILogger<FileDownloadService> logger)
    {
        _context = context;
        _storage = storage;
        _currentUser = currentUser;
        _logger = logger;
    }

    public async Task<FileDownload> OpenAsync(Guid fileId, CancellationToken cancellationToken = default)
    {
        var asset = await _context.FileAssets.AsNoTracking().FirstOrDefaultAsync(f => f.Id == fileId, cancellationToken)
            ?? throw new NotFoundException("File not found.");

        await EnsureCanReadAsync(fileId, cancellationToken);

        Stream content;
        try
        {
            content = await _storage.OpenReadAsync(asset.ObjectKey, cancellationToken);
        }
        catch (FileNotFoundException)
        {
            _logger.LogError("File {FileId} exists in the database but its stored object is missing.", fileId);
            throw new NotFoundException("File not found.");
        }

        return new FileDownload(content, asset.OriginalName, asset.MediaType, asset.SizeBytes);
    }

    /// <summary>
    /// A file is only readable through what it is attached to. Unattached (orphaned) files are not served to anyone.
    /// </summary>
    private async Task EnsureCanReadAsync(Guid fileId, CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId;

        var material = await _context.ResourceAssets.AsNoTracking()
            .Where(ra => ra.FileAssetId == fileId)
            .Select(ra => new { ra.Resource.CourseOfferingId })
            .FirstOrDefaultAsync(cancellationToken);
        if (material is not null)
        {
            if (await IsStaffOfAsync(material.CourseOfferingId, userId, cancellationToken)
                || await IsActivelyEnrolledAsync(material.CourseOfferingId, userId, cancellationToken))
            {
                return;
            }

            throw new ForbiddenException("You do not have access to this file.");
        }

        var submission = await _context.SubmissionAssets.AsNoTracking()
            .Where(sa => sa.FileAssetId == fileId)
            .Select(sa => new { sa.Submission.CourseOfferingId, LearnerId = sa.Submission.LearningEnrollment.LearnerId })
            .FirstOrDefaultAsync(cancellationToken);
        if (submission is not null)
        {
            if (submission.LearnerId == userId || await IsStaffOfAsync(submission.CourseOfferingId, userId, cancellationToken))
            {
                return;
            }

            throw new ForbiddenException("You do not have access to this file.");
        }

        throw new NotFoundException("File not found.");
    }

    /// <summary>Admins, or instructors assigned to the offering.</summary>
    private async Task<bool> IsStaffOfAsync(Guid offeringId, Guid userId, CancellationToken cancellationToken) =>
        _currentUser.IsInRole(AppRoles.Admin)
        || await _context.OfferingInstructors.AnyAsync(oi => oi.OfferingId == offeringId && oi.InstructorId == userId, cancellationToken);

    /// <summary>Same rule as the learner course page: an active learning enrollment on an active enrollment.</summary>
    private Task<bool> IsActivelyEnrolledAsync(Guid offeringId, Guid userId, CancellationToken cancellationToken) =>
        _context.LearningEnrollments.AnyAsync(le =>
            le.LearnerId == userId
            && le.CourseOfferingId == offeringId
            && le.Status == EnrollmentStatuses.Active
            && le.Enrollment.Status == EnrollmentStatuses.Active, cancellationToken);
}
