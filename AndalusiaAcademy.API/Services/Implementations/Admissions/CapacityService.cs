using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using AndalusiaAcademy.API.Data;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.API.Exceptions;
using AndalusiaAcademy.API.Models.Admissions;
using AndalusiaAcademy.API.Models.Capacity;
using AndalusiaAcademy.API.Models.Catalog;
using AndalusiaAcademy.API.Services.Interfaces.Admissions;

namespace AndalusiaAcademy.API.Services.Implementations.Admissions;

public sealed class CapacityService : ICapacityService
{
    private readonly ApplicationDbContext _context;
    private readonly AdmissionsOptions _options;

    public CapacityService(ApplicationDbContext context, IOptions<AdmissionsOptions> options)
    {
        _context = context;
        _options = options.Value;
    }

    public async Task HoldSeatAsync(Application application, Offering offering, DateTimeOffset now, CancellationToken cancellationToken)
    {
        await LockOfferingAsync(offering.Id, cancellationToken);

        var occupied = await CountOccupiedSeatsAsync(offering.Id, now, cancellationToken);
        if (occupied >= offering.Capacity)
        {
            throw new ConflictException("This offering is fully booked.");
        }

        var reservation = new SeatReservation
        {
            Application = application,
            ApplicationId = application.Id,
            Status = ReservationStatuses.Held,
            CreatedAt = now,
            ExpiresAt = now.AddMinutes(_options.SeatHoldMinutes)
        };
        reservation.ReservationItems.Add(new ReservationItem
        {
            SeatReservationId = reservation.Id,
            OfferingId = offering.Id,
            Quantity = 1
        });
        _context.SeatReservations.Add(reservation);
    }

    public async Task EnsureLapsedHoldCanConvertAsync(Guid seatReservationId, DateTimeOffset now, CancellationToken cancellationToken)
    {
        var items = await _context.ReservationItems
            .AsNoTracking()
            .Where(ri => ri.SeatReservationId == seatReservationId)
            .OrderBy(ri => ri.OfferingId) // stable lock order across concurrent callers
            .Select(ri => new { ri.OfferingId, ri.Quantity, ri.Offering.Capacity })
            .ToListAsync(cancellationToken);

        foreach (var item in items)
        {
            await LockOfferingAsync(item.OfferingId, cancellationToken);

            // A lapsed hold is not counted as occupied, so its own seats must still fit.
            var occupied = await CountOccupiedSeatsAsync(item.OfferingId, now, cancellationToken);
            if (occupied + item.Quantity > item.Capacity)
            {
                throw new ConflictException("The seat hold expired and the offering has since been fully booked.");
            }
        }
    }

    public async Task<int> CountOccupiedSeatsAsync(Guid offeringId, DateTimeOffset now, CancellationToken cancellationToken)
    {
        return await _context.ReservationItems
            .Where(ri => ri.OfferingId == offeringId)
            .Where(ri => ri.SeatReservation.Status == ReservationStatuses.Converted
                || (ri.SeatReservation.Status == ReservationStatuses.Held && ri.SeatReservation.ExpiresAt > now))
            .SumAsync(ri => (int?)ri.Quantity, cancellationToken) ?? 0;
    }

    /// <summary>Serialises concurrent seat accounting on the same offering until the caller commits (no overselling).</summary>
    private async Task LockOfferingAsync(Guid offeringId, CancellationToken cancellationToken)
    {
        if (_context.Database.CurrentTransaction is null)
        {
            throw new InvalidOperationException("Seat accounting must run inside a database transaction.");
        }

        await _context.Database.ExecuteSqlInterpolatedAsync(
            $"SELECT [Id] FROM [Offering] WITH (UPDLOCK, ROWLOCK) WHERE [Id] = {offeringId}",
            cancellationToken);
    }
}
