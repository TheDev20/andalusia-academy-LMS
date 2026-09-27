using AndalusiaAcademy.API.Models.Admissions;
using AndalusiaAcademy.API.Models.Catalog;

namespace AndalusiaAcademy.API.Models.Capacity;

public class SeatReservation
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid ApplicationId { get; set; }
    public Application Application { get; set; } = null!;

    public string Status { get; set; } = "Held";
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset ExpiresAt { get; set; }
    public byte[] RowVersion { get; set; } = [];

    // Navigation
    public ICollection<ReservationItem> ReservationItems { get; set; } = new List<ReservationItem>();
}

public class ReservationItem
{
    public Guid SeatReservationId { get; set; }
    public SeatReservation SeatReservation { get; set; } = null!;

    public Guid OfferingId { get; set; }
    public Offering Offering { get; set; } = null!;

    public int Quantity { get; set; } = 1;
}
