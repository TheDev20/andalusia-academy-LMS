using Microsoft.EntityFrameworkCore;
using AndalusiaAcademy.API.Data;
using AndalusiaAcademy.API.DTOs.Operations;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.API.Exceptions;
using AndalusiaAcademy.API.Models.Catalog;
using AndalusiaAcademy.API.Models.Learning;
using AndalusiaAcademy.API.Services.Interfaces.Admissions;
using AndalusiaAcademy.API.Services.Interfaces.Operations;

namespace AndalusiaAcademy.API.Services.Implementations.Operations;

/// <summary>
/// Course offering (intake) management, instructor assignment and learning materials.
/// Program offerings are out of scope for the Sprint 4 admin dashboard.
/// </summary>
public sealed class AdminOfferingService : IAdminOfferingService
{
    private readonly ApplicationDbContext _context;
    private readonly ICapacityService _capacity;
    private readonly TimeProvider _clock;

    public AdminOfferingService(ApplicationDbContext context, ICapacityService capacity, TimeProvider clock)
    {
        _context = context;
        _capacity = capacity;
        _clock = clock;
    }

    public async Task<IReadOnlyList<AdminOfferingDto>> ListAsync(Guid? courseId, CancellationToken cancellationToken = default)
    {
        var offerings = _context.Offerings.AsNoTracking().Where(o => o.Kind == OfferingKinds.Course);
        if (courseId.HasValue)
        {
            offerings = offerings.Where(o => o.CourseId == courseId);
        }

        return await Project(offerings.OrderByDescending(o => o.StartsAt)).ToListAsync(cancellationToken);
    }

    public async Task<AdminOfferingDto> GetAsync(Guid offeringId, CancellationToken cancellationToken = default) =>
        await Project(_context.Offerings.AsNoTracking().Where(o => o.Id == offeringId && o.Kind == OfferingKinds.Course))
            .FirstOrDefaultAsync(cancellationToken)
        ?? throw new NotFoundException("Offering not found.");

    public async Task<AdminOfferingDto> CreateAsync(UpsertOfferingRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);
        if (!await _context.Courses.AnyAsync(c => c.Id == request.CourseId, cancellationToken))
        {
            throw new NotFoundException("Course not found.");
        }

        var offering = new Offering { Kind = OfferingKinds.Course };
        Apply(offering, request);
        _context.Offerings.Add(offering);
        await _context.SaveChangesAsync(cancellationToken);

        return await GetAsync(offering.Id, cancellationToken);
    }

    public async Task<AdminOfferingDto> UpdateAsync(Guid offeringId, UpsertOfferingRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);
        var offering = await FindAsync(offeringId, cancellationToken);

        if (offering.CourseId != request.CourseId &&
            await _context.Applications.AnyAsync(a => a.OfferingId == offeringId, cancellationToken))
        {
            throw new BusinessRuleException("The course of an offering with applications cannot be changed.");
        }

        var seatsTaken = await _capacity.CountOccupiedSeatsAsync(offeringId, _clock.GetUtcNow(), cancellationToken);
        if (request.Capacity < seatsTaken)
        {
            throw new BusinessRuleException($"Capacity cannot be lower than the {seatsTaken} seat(s) already taken.");
        }

        Apply(offering, request);
        await _context.SaveChangesAsync(cancellationToken);

        return await GetAsync(offeringId, cancellationToken);
    }

    public async Task<AdminOfferingDto> AssignInstructorAsync(Guid offeringId, AssignInstructorRequest request, CancellationToken cancellationToken = default)
    {
        await FindAsync(offeringId, cancellationToken);

        var isInstructor = await _context.InstructorProfiles.AnyAsync(ip =>
            ip.UserId == request.InstructorId && ip.User.IsActive &&
            ip.User.UserRoles.Any(ur => ur.Role.Name == AppRoles.Instructor), cancellationToken);
        if (!isInstructor)
        {
            throw new BusinessRuleException("The user is not an active instructor.");
        }

        if (!await _context.OfferingInstructors.AnyAsync(oi => oi.OfferingId == offeringId && oi.InstructorId == request.InstructorId, cancellationToken))
        {
            _context.OfferingInstructors.Add(new OfferingInstructor { OfferingId = offeringId, InstructorId = request.InstructorId });
            await _context.SaveChangesAsync(cancellationToken);
        }

        return await GetAsync(offeringId, cancellationToken);
    }

    public async Task<AdminOfferingDto> UnassignInstructorAsync(Guid offeringId, Guid instructorId, CancellationToken cancellationToken = default)
    {
        var link = await _context.OfferingInstructors
            .FirstOrDefaultAsync(oi => oi.OfferingId == offeringId && oi.InstructorId == instructorId, cancellationToken)
            ?? throw new NotFoundException("Instructor is not assigned to this offering.");

        _context.OfferingInstructors.Remove(link);
        await _context.SaveChangesAsync(cancellationToken);

        return await GetAsync(offeringId, cancellationToken);
    }

    public async Task<IReadOnlyList<AdminResourceDto>> ListResourcesAsync(Guid offeringId, CancellationToken cancellationToken = default)
    {
        await FindAsync(offeringId, cancellationToken);
        return await _context.Resources.AsNoTracking()
            .Where(r => r.CourseOfferingId == offeringId)
            .OrderBy(r => r.Sequence)
            .Select(r => new AdminResourceDto(r.Id, r.CourseOfferingId, r.Title, r.Url, r.Required, r.Sequence))
            .ToListAsync(cancellationToken);
    }

    public async Task<AdminResourceDto> CreateResourceAsync(Guid offeringId, UpsertResourceRequest request, CancellationToken cancellationToken = default)
    {
        await FindAsync(offeringId, cancellationToken);
        await EnsureSequenceFreeAsync(offeringId, request.Sequence, null, cancellationToken);

        var resource = new Resource { CourseOfferingId = offeringId, CourseKind = OfferingKinds.Course };
        Apply(resource, request);
        _context.Resources.Add(resource);
        await _context.SaveChangesAsync(cancellationToken);

        return ToDto(resource);
    }

    public async Task<AdminResourceDto> UpdateResourceAsync(Guid resourceId, UpsertResourceRequest request, CancellationToken cancellationToken = default)
    {
        var resource = await _context.Resources.FirstOrDefaultAsync(r => r.Id == resourceId, cancellationToken)
            ?? throw new NotFoundException("Resource not found.");
        await EnsureSequenceFreeAsync(resource.CourseOfferingId, request.Sequence, resourceId, cancellationToken);

        Apply(resource, request);
        await _context.SaveChangesAsync(cancellationToken);

        return ToDto(resource);
    }

    public async Task DeleteResourceAsync(Guid resourceId, CancellationToken cancellationToken = default)
    {
        var resource = await _context.Resources.FirstOrDefaultAsync(r => r.Id == resourceId, cancellationToken)
            ?? throw new NotFoundException("Resource not found.");

        if (await _context.ResourceProgresses.AnyAsync(p => p.ResourceId == resourceId, cancellationToken))
        {
            throw new ConflictException("Learners have already completed this resource; it cannot be deleted.");
        }

        _context.Resources.Remove(resource);
        await _context.SaveChangesAsync(cancellationToken);
    }

    private async Task<Offering> FindAsync(Guid offeringId, CancellationToken cancellationToken) =>
        await _context.Offerings.FirstOrDefaultAsync(o => o.Id == offeringId && o.Kind == OfferingKinds.Course, cancellationToken)
        ?? throw new NotFoundException("Offering not found.");

    private async Task EnsureSequenceFreeAsync(Guid offeringId, int sequence, Guid? excludeId, CancellationToken cancellationToken)
    {
        if (await _context.Resources.AnyAsync(r => r.CourseOfferingId == offeringId && r.Sequence == sequence && r.Id != excludeId, cancellationToken))
        {
            throw new ConflictException($"Another resource already uses sequence {sequence} in this offering.");
        }
    }

    private static void Validate(UpsertOfferingRequest request)
    {
        if (request.EndsAt <= request.StartsAt)
        {
            throw new BusinessRuleException("EndsAt must be after StartsAt.");
        }
    }

    private static void Apply(Offering offering, UpsertOfferingRequest request)
    {
        offering.CourseId = request.CourseId;
        offering.StartsAt = request.StartsAt;
        offering.EndsAt = request.EndsAt;
        offering.TimeZoneId = request.TimeZoneId.Trim();
        offering.Price = request.Price;
        offering.Currency = request.Currency.Trim().ToUpperInvariant();
        offering.Capacity = request.Capacity;
        offering.Status = request.Status;
    }

    private static void Apply(Resource resource, UpsertResourceRequest request)
    {
        resource.Title = request.Title.Trim();
        resource.Url = string.IsNullOrWhiteSpace(request.Url) ? null : request.Url.Trim();
        resource.Required = request.Required;
        resource.Sequence = request.Sequence;
    }

    private static AdminResourceDto ToDto(Resource r) => new(r.Id, r.CourseOfferingId, r.Title, r.Url, r.Required, r.Sequence);

    private IQueryable<AdminOfferingDto> Project(IQueryable<Offering> offerings)
    {
        var now = _clock.GetUtcNow();
        return offerings.Select(o => new AdminOfferingDto(
            o.Id,
            o.CourseId!.Value,
            o.Course!.Title,
            o.StartsAt,
            o.EndsAt,
            o.TimeZoneId,
            o.Price,
            o.Currency,
            o.Capacity,
            _context.ReservationItems
                .Where(ri => ri.OfferingId == o.Id)
                .Where(ri => ri.SeatReservation.Status == ReservationStatuses.Converted
                    || (ri.SeatReservation.Status == ReservationStatuses.Held && ri.SeatReservation.ExpiresAt > now))
                .Sum(ri => (int?)ri.Quantity) ?? 0,
            o.Status,
            _context.OfferingInstructors
                .Where(oi => oi.OfferingId == o.Id)
                .Select(oi => new OfferingInstructorDto(
                    oi.InstructorId, oi.Instructor.User.FirstName + " " + oi.Instructor.User.LastName, oi.Instructor.User.Email))
                .ToList()));
    }
}
