using System.Data;
using Microsoft.EntityFrameworkCore;
using AndalusiaAcademy.API.Data;
using AndalusiaAcademy.API.DTOs.Admissions;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.API.Exceptions;
using AndalusiaAcademy.API.Mapping.Admissions;
using AndalusiaAcademy.API.Models.Admissions;
using AndalusiaAcademy.API.Services.Interfaces.Admissions;

namespace AndalusiaAcademy.API.Services.Implementations.Admissions;

public sealed class ApplicationService : IApplicationService
{
    private readonly ApplicationDbContext _context;
    private readonly ICapacityService _capacity;
    private readonly TimeProvider _clock;
    private readonly ILogger<ApplicationService> _logger;

    public ApplicationService(
        ApplicationDbContext context,
        ICapacityService capacity,
        TimeProvider clock,
        ILogger<ApplicationService> logger)
    {
        _context = context;
        _capacity = capacity;
        _clock = clock;
        _logger = logger;
    }

    public async Task<ApplicationDto> SubmitAsync(Guid learnerId, CreateApplicationRequest request, CancellationToken cancellationToken = default)
    {
        var now = _clock.GetUtcNow();

        var offering = await _context.Offerings
            .Include(o => o.Course)
            .Include(o => o.Program)
            .FirstOrDefaultAsync(o => o.Id == request.OfferingId, cancellationToken)
            ?? throw new NotFoundException("Offering not found.");

        var parentPublished = offering.Course?.PublicationStatus == PublicationStatuses.Published
            || offering.Program?.PublicationStatus == PublicationStatuses.Published;
        if (offering.Status != OfferingStatuses.Published || !parentPublished)
        {
            throw new BusinessRuleException("This offering is not open for applications.");
        }

        if (offering.StartsAt <= now)
        {
            throw new BusinessRuleException("Applications are closed because this offering has already started.");
        }

        await using var transaction = await _context.Database.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        await ExpireStaleApplicationsAsync(learnerId, offering.Id, now, cancellationToken);

        var hasLiveApplication = await _context.Applications.AnyAsync(a =>
            a.LearnerId == learnerId && a.OfferingId == offering.Id &&
            (a.Status == ApplicationStatuses.Submitted || a.Status == ApplicationStatuses.Accepted), cancellationToken);
        if (hasLiveApplication)
        {
            throw new ConflictException("You already have an active application for this offering.");
        }

        var application = new Application
        {
            LearnerId = learnerId,
            OfferingId = offering.Id,
            Status = ApplicationStatuses.Submitted,
            SubmittedAt = now,
            CreatedAt = now
        };
        _context.Applications.Add(application);

        await _capacity.HoldSeatAsync(application, offering, now, cancellationToken);

        await _context.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        _logger.LogInformation("Application {ApplicationId} submitted by learner {LearnerId} for offering {OfferingId}",
            application.Id, learnerId, offering.Id);

        return await GetForLearnerAsync(learnerId, application.Id, cancellationToken);
    }

    public async Task<IReadOnlyList<ApplicationDto>> GetForLearnerAsync(Guid learnerId, CancellationToken cancellationToken = default)
    {
        return await _context.Applications
            .AsNoTracking()
            .Where(a => a.LearnerId == learnerId)
            .OrderByDescending(a => a.CreatedAt)
            .Select(AdmissionsMappings.ToApplicationDto(_context))
            .ToListAsync(cancellationToken);
    }

    public async Task<ApplicationDto> GetForLearnerAsync(Guid learnerId, Guid applicationId, CancellationToken cancellationToken = default)
    {
        return await _context.Applications
            .AsNoTracking()
            .Where(a => a.Id == applicationId && a.LearnerId == learnerId)
            .Select(AdmissionsMappings.ToApplicationDto(_context))
            .FirstOrDefaultAsync(cancellationToken)
            ?? throw new NotFoundException("Application not found.");
    }

    public async Task<ApplicationDto> CancelAsync(Guid learnerId, Guid applicationId, CancellationToken cancellationToken = default)
    {
        var application = await _context.Applications
            .FirstOrDefaultAsync(a => a.Id == applicationId && a.LearnerId == learnerId, cancellationToken)
            ?? throw new NotFoundException("Application not found.");

        if (application.Status != ApplicationStatuses.Submitted)
        {
            throw new BusinessRuleException($"An application in status '{application.Status}' cannot be cancelled.");
        }

        application.Status = ApplicationStatuses.Cancelled;
        await ReleaseReservationAndOrderAsync(application.Id, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return await GetForLearnerAsync(learnerId, applicationId, cancellationToken);
    }

    /// <summary>
    /// Lazily expires the learner's lapsed seat holds for the offering so they can re-apply
    /// (the Worker's ReservationCleanup job performs the same sweep globally).
    /// </summary>
    private async Task ExpireStaleApplicationsAsync(Guid learnerId, Guid offeringId, DateTimeOffset now, CancellationToken cancellationToken)
    {
        var stale = await _context.Applications
            .Where(a => a.LearnerId == learnerId && a.OfferingId == offeringId && a.Status == ApplicationStatuses.Submitted)
            .Where(a => _context.SeatReservations.Any(r =>
                r.ApplicationId == a.Id && r.Status == ReservationStatuses.Held && r.ExpiresAt <= now))
            .ToListAsync(cancellationToken);

        foreach (var application in stale)
        {
            application.Status = ApplicationStatuses.Expired;
            await ReleaseReservationAndOrderAsync(application.Id, cancellationToken);
        }

        if (stale.Count > 0)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }
    }

    private async Task ReleaseReservationAndOrderAsync(Guid applicationId, CancellationToken cancellationToken)
    {
        var reservation = await _context.SeatReservations
            .FirstOrDefaultAsync(r => r.ApplicationId == applicationId && r.Status == ReservationStatuses.Held, cancellationToken);
        if (reservation is not null)
        {
            reservation.Status = ReservationStatuses.Released;
        }

        var order = await _context.SalesOrders
            .FirstOrDefaultAsync(o => o.ApplicationId == applicationId && o.Status == OrderStatuses.PendingPayment, cancellationToken);
        if (order is not null)
        {
            order.Status = OrderStatuses.Cancelled;
        }
    }
}
