using System.Linq.Expressions;
using AndalusiaAcademy.API.DTOs.Payments;
using AndalusiaAcademy.API.Models.Payments;

namespace AndalusiaAcademy.API.Mapping.Payments;

public static class PaymentsMappings
{
    public static Expression<Func<SalesOrder, OrderDto>> ToOrderDto()
    {
        return o => new OrderDto(
            o.Id,
            o.ApplicationId,
            o.Application.Offering.Course != null ? o.Application.Offering.Course.Title : o.Application.Offering.Program!.Title,
            o.AmountDue,
            o.Currency,
            o.Status,
            o.CreatedAt,
            o.PaymentAttempts
                .OrderBy(pa => pa.CreatedAt)
                .Select(pa => new PaymentAttemptDto(
                    pa.Id, pa.Amount, pa.Currency, pa.Provider, pa.ProviderPaymentId, pa.Status, pa.CreatedAt, pa.SettledAt))
                .ToList());
    }

    public static PaymentAttemptDto ToDto(this PaymentAttempt pa) =>
        new(pa.Id, pa.Amount, pa.Currency, pa.Provider, pa.ProviderPaymentId, pa.Status, pa.CreatedAt, pa.SettledAt);
}
