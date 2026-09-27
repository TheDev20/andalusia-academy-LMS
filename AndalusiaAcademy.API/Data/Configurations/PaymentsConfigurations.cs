using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using AndalusiaAcademy.API.Models.Payments;

namespace AndalusiaAcademy.API.Data.Configurations;

public class SalesOrderConfiguration : IEntityTypeConfiguration<SalesOrder>
{
    public void Configure(EntityTypeBuilder<SalesOrder> builder)
    {
        builder.ToTable("SalesOrder");
        builder.HasKey(so => so.Id);

        builder.Property(so => so.AmountDue).HasPrecision(19, 4);
        builder.Property(so => so.Currency).HasMaxLength(3).IsUnicode(false).IsFixedLength().IsRequired();
        builder.Property(so => so.Status).HasMaxLength(24).IsRequired();
        builder.Property(so => so.RowVersion).IsRowVersion();

        builder.HasIndex(so => so.ApplicationId).IsUnique();

        builder.HasOne(so => so.Application)
            .WithMany()
            .HasForeignKey(so => so.ApplicationId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class PaymentAttemptConfiguration : IEntityTypeConfiguration<PaymentAttempt>
{
    public void Configure(EntityTypeBuilder<PaymentAttempt> builder)
    {
        builder.ToTable("PaymentAttempt");
        builder.HasKey(pa => pa.Id);

        builder.Property(pa => pa.Amount).HasPrecision(19, 4);
        builder.Property(pa => pa.Currency).HasMaxLength(3).IsUnicode(false).IsFixedLength().IsRequired();
        builder.Property(pa => pa.Provider).HasMaxLength(60).IsRequired();
        builder.Property(pa => pa.ProviderPaymentId).HasMaxLength(200);
        builder.Property(pa => pa.IdempotencyKey).HasMaxLength(100).IsRequired();
        builder.Property(pa => pa.Status).HasMaxLength(24).IsRequired();
        builder.Property(pa => pa.RowVersion).IsRowVersion();

        builder.HasIndex(pa => pa.IdempotencyKey).IsUnique();
        builder.HasIndex(pa => new { pa.Provider, pa.ProviderPaymentId })
            .IsUnique()
            .HasFilter("[ProviderPaymentId] IS NOT NULL");

        builder.HasOne(pa => pa.SalesOrder)
            .WithMany(so => so.PaymentAttempts)
            .HasForeignKey(pa => pa.SalesOrderId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class PaymentAdjustmentConfiguration : IEntityTypeConfiguration<PaymentAdjustment>
{
    public void Configure(EntityTypeBuilder<PaymentAdjustment> builder)
    {
        builder.ToTable("PaymentAdjustment");
        builder.HasKey(pa => pa.Id);

        builder.Property(pa => pa.Amount).HasPrecision(19, 4);
        builder.Property(pa => pa.Currency).HasMaxLength(3).IsUnicode(false).IsFixedLength().IsRequired();
        builder.Property(pa => pa.Reason).HasMaxLength(1000).IsRequired();

        builder.HasOne(pa => pa.PaymentAttempt)
            .WithMany(p => p.PaymentAdjustments)
            .HasForeignKey(pa => pa.PaymentAttemptId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(pa => pa.CreatedByUser)
            .WithMany()
            .HasForeignKey(pa => pa.CreatedByUserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class RefundConfiguration : IEntityTypeConfiguration<Refund>
{
    public void Configure(EntityTypeBuilder<Refund> builder)
    {
        builder.ToTable("Refund");
        builder.HasKey(r => r.Id);

        builder.Property(r => r.Amount).HasPrecision(19, 4);
        builder.Property(r => r.Currency).HasMaxLength(3).IsUnicode(false).IsFixedLength().IsRequired();
        builder.Property(r => r.Reason).HasMaxLength(1000).IsRequired();
        builder.Property(r => r.IdempotencyKey).HasMaxLength(100).IsRequired();
        builder.Property(r => r.ProviderRefundId).HasMaxLength(200);
        builder.Property(r => r.Status).HasMaxLength(24).IsRequired();
        builder.Property(r => r.RowVersion).IsRowVersion();

        builder.HasIndex(r => r.IdempotencyKey).IsUnique();
        builder.HasIndex(r => new { r.PaymentAttemptId, r.ProviderRefundId })
            .IsUnique()
            .HasFilter("[ProviderRefundId] IS NOT NULL");

        builder.HasOne(r => r.PaymentAttempt)
            .WithMany(pa => pa.Refunds)
            .HasForeignKey(r => r.PaymentAttemptId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class ReconciliationCaseConfiguration : IEntityTypeConfiguration<ReconciliationCase>
{
    public void Configure(EntityTypeBuilder<ReconciliationCase> builder)
    {
        builder.ToTable("ReconciliationCase");
        builder.HasKey(rc => rc.Id);

        builder.Property(rc => rc.Reason).HasMaxLength(1000).IsRequired();
        builder.Property(rc => rc.Status).HasMaxLength(24).IsRequired();
        builder.Property(rc => rc.Resolution).HasMaxLength(2000);
        builder.Property(rc => rc.RowVersion).IsRowVersion();

        builder.HasOne(rc => rc.PaymentAttempt)
            .WithMany(pa => pa.ReconciliationCases)
            .HasForeignKey(rc => rc.PaymentAttemptId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class WebhookInboxConfiguration : IEntityTypeConfiguration<WebhookInbox>
{
    public void Configure(EntityTypeBuilder<WebhookInbox> builder)
    {
        builder.ToTable("WebhookInbox");
        builder.HasKey(wi => wi.Id);

        builder.Property(wi => wi.Provider).HasMaxLength(60).IsRequired();
        builder.Property(wi => wi.ProviderEventId).HasMaxLength(200).IsRequired();
        builder.Property(wi => wi.Status).HasMaxLength(24).IsRequired();
        builder.Property(wi => wi.LastError).HasMaxLength(2000);
        builder.Property(wi => wi.RowVersion).IsRowVersion();

        builder.HasIndex(wi => new { wi.Provider, wi.ProviderEventId }).IsUnique();
    }
}
