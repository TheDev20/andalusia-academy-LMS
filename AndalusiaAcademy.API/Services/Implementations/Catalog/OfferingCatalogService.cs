using Microsoft.EntityFrameworkCore;
using AndalusiaAcademy.API.Data;
using AndalusiaAcademy.API.DTOs.Catalog;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.API.Exceptions;
using AndalusiaAcademy.API.Services.Interfaces.Catalog;

namespace AndalusiaAcademy.API.Services.Implementations.Catalog;

public class OfferingCatalogService : IOfferingCatalogService
{
    private readonly ApplicationDbContext _context;
    private readonly TimeProvider _clock;

    public OfferingCatalogService(ApplicationDbContext context, TimeProvider clock)
    {
        _context = context;
        _clock = clock;
    }

    public async Task<IReadOnlyList<OpenOfferingDto>> GetOpenOfferingsAsync(string courseSlug, CancellationToken cancellationToken = default)
    {
        var now = _clock.GetUtcNow();

        var courseId = await _context.Courses
            .AsNoTracking()
            .Where(c => c.Slug == courseSlug && c.PublicationStatus == PublicationStatuses.Published)
            .Select(c => (Guid?)c.Id)
            .FirstOrDefaultAsync(cancellationToken)
            ?? throw new NotFoundException("Course not found.");

        return await _context.Offerings
            .AsNoTracking()
            .Where(o => o.CourseId == courseId && o.Status == OfferingStatuses.Published && o.StartsAt > now)
            .OrderBy(o => o.StartsAt)
            .Select(o => new OpenOfferingDto(
                o.Id,
                o.StartsAt,
                o.EndsAt,
                o.TimeZoneId,
                o.Price,
                o.Currency,
                o.Capacity - (_context.ReservationItems
                    .Where(ri => ri.OfferingId == o.Id)
                    .Where(ri => ri.SeatReservation.Status == ReservationStatuses.Converted
                        || (ri.SeatReservation.Status == ReservationStatuses.Held && ri.SeatReservation.ExpiresAt > now))
                    .Sum(ri => (int?)ri.Quantity) ?? 0)))
            .ToListAsync(cancellationToken);
    }
}
