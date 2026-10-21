using Microsoft.EntityFrameworkCore;
using AndalusiaAcademy.API.Data;
using AndalusiaAcademy.API.DTOs.Operations;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.API.Exceptions;
using AndalusiaAcademy.API.Models.Learning;
using AndalusiaAcademy.API.Services.Interfaces.Operations;

namespace AndalusiaAcademy.API.Services.Implementations.Operations;

public sealed class AdminScheduleService : IAdminScheduleService
{
    private readonly ApplicationDbContext _context;

    public AdminScheduleService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<AdminLocationDto>> ListLocationsAsync(CancellationToken cancellationToken = default) =>
        await _context.Locations.AsNoTracking()
            .OrderBy(l => l.Name)
            .Select(l => new AdminLocationDto(l.Id, l.Name, l.Address, l.MeetingUrl))
            .ToListAsync(cancellationToken);

    public async Task<AdminLocationDto> CreateLocationAsync(UpsertLocationRequest request, CancellationToken cancellationToken = default)
    {
        var location = new Location();
        Apply(location, request);
        _context.Locations.Add(location);
        await _context.SaveChangesAsync(cancellationToken);
        return new AdminLocationDto(location.Id, location.Name, location.Address, location.MeetingUrl);
    }

    public async Task<AdminLocationDto> UpdateLocationAsync(Guid locationId, UpsertLocationRequest request, CancellationToken cancellationToken = default)
    {
        var location = await _context.Locations.FirstOrDefaultAsync(l => l.Id == locationId, cancellationToken)
            ?? throw new NotFoundException("Location not found.");
        Apply(location, request);
        await _context.SaveChangesAsync(cancellationToken);
        return new AdminLocationDto(location.Id, location.Name, location.Address, location.MeetingUrl);
    }

    public async Task<IReadOnlyList<AdminSessionDto>> ListSessionsAsync(Guid offeringId, CancellationToken cancellationToken = default)
    {
        await EnsureCourseOfferingAsync(offeringId, cancellationToken);
        return await _context.Sessions.AsNoTracking()
            .Where(s => s.CourseOfferingId == offeringId)
            .OrderBy(s => s.StartsAt)
            .Select(s => new AdminSessionDto(s.Id, s.CourseOfferingId, s.Title, s.StartsAt, s.EndsAt, s.Status, s.LocationId,
                s.Location != null ? s.Location.Name : null))
            .ToListAsync(cancellationToken);
    }

    public async Task<AdminSessionDto> CreateSessionAsync(Guid offeringId, UpsertSessionRequest request, CancellationToken cancellationToken = default)
    {
        await EnsureCourseOfferingAsync(offeringId, cancellationToken);
        await ValidateAsync(request, cancellationToken);

        var session = new Session { CourseOfferingId = offeringId, CourseKind = OfferingKinds.Course };
        Apply(session, request);
        _context.Sessions.Add(session);
        await _context.SaveChangesAsync(cancellationToken);

        return await GetSessionAsync(session.Id, cancellationToken);
    }

    public async Task<AdminSessionDto> UpdateSessionAsync(Guid sessionId, UpsertSessionRequest request, CancellationToken cancellationToken = default)
    {
        var session = await _context.Sessions.FirstOrDefaultAsync(s => s.Id == sessionId, cancellationToken)
            ?? throw new NotFoundException("Session not found.");
        await ValidateAsync(request, cancellationToken);

        Apply(session, request);
        await _context.SaveChangesAsync(cancellationToken);

        return await GetSessionAsync(sessionId, cancellationToken);
    }

    public async Task DeleteSessionAsync(Guid sessionId, CancellationToken cancellationToken = default)
    {
        var session = await _context.Sessions.FirstOrDefaultAsync(s => s.Id == sessionId, cancellationToken)
            ?? throw new NotFoundException("Session not found.");

        if (await _context.Attendances.AnyAsync(a => a.SessionId == sessionId, cancellationToken))
        {
            throw new ConflictException("Attendance has been recorded for this session; cancel it instead of deleting.");
        }

        _context.Sessions.Remove(session);
        await _context.SaveChangesAsync(cancellationToken);
    }

    private async Task<AdminSessionDto> GetSessionAsync(Guid sessionId, CancellationToken cancellationToken) =>
        await _context.Sessions.AsNoTracking()
            .Where(s => s.Id == sessionId)
            .Select(s => new AdminSessionDto(s.Id, s.CourseOfferingId, s.Title, s.StartsAt, s.EndsAt, s.Status, s.LocationId,
                s.Location != null ? s.Location.Name : null))
            .FirstAsync(cancellationToken);

    private async Task EnsureCourseOfferingAsync(Guid offeringId, CancellationToken cancellationToken)
    {
        if (!await _context.Offerings.AnyAsync(o => o.Id == offeringId && o.Kind == OfferingKinds.Course, cancellationToken))
        {
            throw new NotFoundException("Offering not found.");
        }
    }

    private async Task ValidateAsync(UpsertSessionRequest request, CancellationToken cancellationToken)
    {
        if (request.EndsAt <= request.StartsAt)
        {
            throw new BusinessRuleException("EndsAt must be after StartsAt.");
        }

        if (request.LocationId.HasValue && !await _context.Locations.AnyAsync(l => l.Id == request.LocationId, cancellationToken))
        {
            throw new BusinessRuleException("Location not found.");
        }
    }

    private static void Apply(Location location, UpsertLocationRequest request)
    {
        location.Name = request.Name.Trim();
        location.Address = string.IsNullOrWhiteSpace(request.Address) ? null : request.Address.Trim();
        location.MeetingUrl = string.IsNullOrWhiteSpace(request.MeetingUrl) ? null : request.MeetingUrl.Trim();
    }

    private static void Apply(Session session, UpsertSessionRequest request)
    {
        session.Title = request.Title.Trim();
        session.StartsAt = request.StartsAt;
        session.EndsAt = request.EndsAt;
        session.LocationId = request.LocationId;
        session.Status = request.Status;
    }
}
