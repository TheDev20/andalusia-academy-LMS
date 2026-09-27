using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using AndalusiaAcademy.API.Models.Compensation;

namespace AndalusiaAcademy.API.Data.Configurations;

public class InstructorAgreementConfiguration : IEntityTypeConfiguration<InstructorAgreement>
{
    public void Configure(EntityTypeBuilder<InstructorAgreement> builder)
    {
        builder.ToTable("InstructorAgreement");
        builder.HasKey(ia => ia.Id);
        builder.HasAlternateKey(ia => new { ia.Id, ia.InstructorId, ia.Currency });

        builder.Property(ia => ia.Rate).HasPrecision(19, 4);
        builder.Property(ia => ia.Currency).HasMaxLength(3).IsUnicode(false).IsFixedLength().IsRequired();
        builder.Property(ia => ia.Basis).HasMaxLength(24).IsRequired();
        builder.Property(ia => ia.RowVersion).IsRowVersion();

        builder.HasIndex(ia => new { ia.OfferingId, ia.InstructorId, ia.Version }).IsUnique();

        builder.HasOne(ia => ia.Offering)
            .WithMany()
            .HasForeignKey(ia => ia.OfferingId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(ia => ia.Instructor)
            .WithMany()
            .HasForeignKey(ia => ia.InstructorId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class EarningEntryConfiguration : IEntityTypeConfiguration<EarningEntry>
{
    public void Configure(EntityTypeBuilder<EarningEntry> builder)
    {
        builder.ToTable("EarningEntry");
        builder.HasKey(ee => ee.Id);
        builder.HasAlternateKey(ee => new { ee.Id, ee.InstructorId, ee.Currency });

        builder.Property(ee => ee.Quantity).HasPrecision(19, 4);
        builder.Property(ee => ee.Rate).HasPrecision(19, 4);
        builder.Property(ee => ee.Amount).HasPrecision(19, 4);
        builder.Property(ee => ee.Currency).HasMaxLength(3).IsUnicode(false).IsFixedLength().IsRequired();
        builder.Property(ee => ee.SourceKey).HasMaxLength(150).IsRequired();
        builder.Property(ee => ee.RowVersion).IsRowVersion();

        builder.HasIndex(ee => new { ee.InstructorAgreementId, ee.SourceKey }).IsUnique();

        builder.HasOne(ee => ee.InstructorAgreement)
            .WithMany(ia => ia.EarningEntries)
            .HasPrincipalKey(ia => new { ia.Id, ia.InstructorId, ia.Currency })
            .HasForeignKey(ee => new { ee.InstructorAgreementId, ee.InstructorId, ee.Currency })
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(ee => ee.Instructor)
            .WithMany()
            .HasForeignKey(ee => ee.InstructorId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class PayoutConfiguration : IEntityTypeConfiguration<Payout>
{
    public void Configure(EntityTypeBuilder<Payout> builder)
    {
        builder.ToTable("Payout");
        builder.HasKey(p => p.Id);
        builder.HasAlternateKey(p => new { p.Id, p.InstructorId, p.Currency });

        builder.Property(p => p.Amount).HasPrecision(19, 4);
        builder.Property(p => p.Currency).HasMaxLength(3).IsUnicode(false).IsFixedLength().IsRequired();
        builder.Property(p => p.Provider).HasMaxLength(60).IsRequired();
        builder.Property(p => p.ProviderPayoutId).HasMaxLength(200);
        builder.Property(p => p.IdempotencyKey).HasMaxLength(100).IsRequired();
        builder.Property(p => p.Status).HasMaxLength(24).IsRequired();
        builder.Property(p => p.RowVersion).IsRowVersion();

        builder.HasIndex(p => p.IdempotencyKey).IsUnique();
        builder.HasIndex(p => new { p.Provider, p.ProviderPayoutId })
            .IsUnique()
            .HasFilter("[ProviderPayoutId] IS NOT NULL");

        builder.HasOne(p => p.Instructor)
            .WithMany()
            .HasForeignKey(p => p.InstructorId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class PayoutAllocationConfiguration : IEntityTypeConfiguration<PayoutAllocation>
{
    public void Configure(EntityTypeBuilder<PayoutAllocation> builder)
    {
        builder.ToTable("PayoutAllocation");
        builder.HasKey(pa => new { pa.PayoutId, pa.EarningEntryId });

        builder.Property(pa => pa.Amount).HasPrecision(19, 4);
        builder.Property(pa => pa.Currency).HasMaxLength(3).IsUnicode(false).IsFixedLength().IsRequired();

        builder.HasOne(pa => pa.Payout)
            .WithMany(p => p.PayoutAllocations)
            .HasPrincipalKey(p => new { p.Id, p.InstructorId, p.Currency })
            .HasForeignKey(pa => new { pa.PayoutId, pa.InstructorId, pa.Currency })
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(pa => pa.EarningEntry)
            .WithMany(ee => ee.PayoutAllocations)
            .HasPrincipalKey(ee => new { ee.Id, ee.InstructorId, ee.Currency })
            .HasForeignKey(pa => new { pa.EarningEntryId, pa.InstructorId, pa.Currency })
            .OnDelete(DeleteBehavior.Restrict);
    }
}
