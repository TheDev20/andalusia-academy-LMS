using Microsoft.EntityFrameworkCore;
using AndalusiaAcademy.API.Data;
using AndalusiaAcademy.API.DTOs.Common;
using AndalusiaAcademy.API.DTOs.Operations;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.API.Services.Interfaces.Operations;

namespace AndalusiaAcademy.API.Services.Implementations.Operations;

public sealed class AdminPaymentService : IAdminPaymentService
{
    private readonly ApplicationDbContext _context;

    public AdminPaymentService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResult<AdminOrderDto>> ListOrdersAsync(AdminOrderQuery query, CancellationToken cancellationToken = default)
    {
        var orders = _context.SalesOrders.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(query.Status))
        {
            orders = orders.Where(o => o.Status == query.Status);
        }

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var term = query.Search.Trim();
            orders = orders.Where(o => o.Application.Learner.Email.Contains(term));
        }

        var total = await orders.CountAsync(cancellationToken);
        var items = await orders
            .OrderByDescending(o => o.CreatedAt).ThenBy(o => o.Id)
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(o => new AdminOrderDto(
                o.Id,
                o.ApplicationId,
                o.Application.LearnerId,
                o.Application.Learner.Email,
                o.Application.Offering.Course != null ? o.Application.Offering.Course.Title : o.Application.Offering.Program!.Title,
                o.AmountDue,
                o.Currency,
                o.Status,
                o.CreatedAt,
                o.PaymentAttempts.Count,
                o.PaymentAttempts
                    .Where(pa => pa.Status == PaymentAttemptStatuses.Succeeded)
                    .Select(pa => pa.SettledAt)
                    .FirstOrDefault()))
            .ToListAsync(cancellationToken);

        return new PagedResult<AdminOrderDto>(items, total, query.PageNumber, query.PageSize);
    }
}
