using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using AndalusiaAcademy.API.Models.Capacity;

namespace AndalusiaAcademy.API.Data.Configurations;

public class SeatReservationConfiguration : IEntityTypeConfiguration<SeatReservation>
{
    public void Configure(EntityTypeBuilder<SeatReservation> builder)
    {
        builder.ToTable("SeatReservation");
        builder.HasKey(sr => sr.Id);

        builder.Property(sr => sr.Status).HasMaxLength(24).IsRequired();
        builder.Property(sr => sr.RowVersion).IsRowVersion();

        builder.HasIndex(sr => sr.ApplicationId).IsUnique();

        builder.HasOne(sr => sr.Application)
            .WithMany()
            .HasForeignKey(sr => sr.ApplicationId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class ReservationItemConfiguration : IEntityTypeConfiguration<ReservationItem>
{
    public void Configure(EntityTypeBuilder<ReservationItem> builder)
    {
        builder.ToTable("ReservationItem");
        builder.HasKey(ri => new { ri.SeatReservationId, ri.OfferingId });

        builder.HasOne(ri => ri.SeatReservation)
            .WithMany(sr => sr.ReservationItems)
            .HasForeignKey(ri => ri.SeatReservationId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(ri => ri.Offering)
            .WithMany()
            .HasForeignKey(ri => ri.OfferingId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
