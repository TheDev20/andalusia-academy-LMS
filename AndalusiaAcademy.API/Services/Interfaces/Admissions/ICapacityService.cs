using AndalusiaAcademy.API.Models.Admissions;
using AndalusiaAcademy.API.Models.Catalog;

namespace AndalusiaAcademy.API.Services.Interfaces.Admissions;

/// <summary>
/// Seat accounting for offerings. Callers must hold an open database transaction.
/// </summary>
public interface ICapacityService
{
    /// <summary>
    /// Takes an update lock on the offering row, verifies a seat is free and stages a Held reservation.
    /// Throws <see cref="Exceptions.ConflictException"/> when the offering is full.
    /// </summary>
    Task HoldSeatAsync(Application application, Offering offering, DateTimeOffset now, CancellationToken cancellationToken);

    Task<int> CountOccupiedSeatsAsync(Guid offeringId, DateTimeOffset now, CancellationToken cancellationToken);
}
