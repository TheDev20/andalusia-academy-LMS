using System.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using AndalusiaAcademy.API.Data;
using AndalusiaAcademy.API.DTOs.Payments;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.API.Exceptions;
using AndalusiaAcademy.API.Mapping.Payments;
using AndalusiaAcademy.API.Models.Payments;
using AndalusiaAcademy.API.Services.Interfaces.Admissions;
using AndalusiaAcademy.API.Services.Interfaces.Payments;

namespace AndalusiaAcademy.API.Services.Implementations.Payments;

public sealed class PaymentService : IPaymentService
{
    private readonly ApplicationDbContext _context;
    private readonly IPaymentGateway _gateway;
    private readonly IEnrollmentService _enrollments;
    private readonly ICapacityService _capacity;
    private readonly PaymentOptions _options;
    private readonly TimeProvider _clock;
    private readonly ILogger<PaymentService> _logger;

    public PaymentService(
        ApplicationDbContext context,
        IPaymentGateway gateway,
        IEnrollmentService enrollments,
        ICapacityService capacity,
        IOptions<PaymentOptions> options,
        TimeProvider clock,
        ILogger<PaymentService> logger)
    {
        _context = context;
        _gateway = gateway;
        _enrollments = enrollments;
        _capacity = capacity;
        _options = options.Value;
        _clock = clock;
        _logger = logger;
    }

    public async Task<OrderDto> CreateOrderAsync(Guid learnerId, CreateOrderRequest request, CancellationToken cancellationToken = default)
    {
        var now = _clock.GetUtcNow();
        var application = await _context.Applications
            .Include(a => a.Offering)
            .FirstOrDefaultAsync(a => a.Id == request.ApplicationId && a.LearnerId == learnerId, cancellationToken)
            ?? throw new NotFoundException("Application not found.");

        var existing = await _context.SalesOrders
            .AsNoTracking()
            .Where(o => o.ApplicationId == application.Id)
            .Select(o => o.Id)
            .FirstOrDefaultAsync(cancellationToken);
        if (existing != Guid.Empty)
        {
            return await GetOrderAsync(existing, cancellationToken);
        }

        if (application.Status != ApplicationStatuses.Submitted)
        {
            throw new BusinessRuleException($"An application in status '{application.Status}' cannot be checked out.");
        }

        await EnsureSeatHeldAsync(application.Id, now, cancellationToken);

        var order = new SalesOrder
        {
            ApplicationId = application.Id,
            AmountDue = application.Offering.Price,
            Currency = application.Offering.Currency,
            Status = OrderStatuses.PendingPayment,
            CreatedAt = now
        };
        _context.SalesOrders.Add(order);
        // Unique index on SalesOrder.ApplicationId resolves concurrent checkouts (loser gets 409).
        await _context.SaveChangesAsync(cancellationToken);

        return await GetOrderAsync(order.Id, cancellationToken);
    }

    public async Task<PaymentResultDto> PayWithSimulationAsync(
        Guid learnerId, Guid orderId, SimulatePaymentRequest request, string idempotencyKey, CancellationToken cancellationToken = default)
    {
        if (!_options.SimulationEnabled)
        {
            throw new ServiceUnavailableException("Payment simulation is disabled in this environment.");
        }

        var replay = await FindReplayAsync(learnerId, orderId, idempotencyKey, cancellationToken);
        if (replay is not null)
        {
            return replay;
        }

        var now = _clock.GetUtcNow();

        // Phase 1: validate and durably record the attempt before talking to the provider.
        var order = await LoadOwnedOrderAsync(learnerId, orderId, cancellationToken);
        if (order.Status != OrderStatuses.PendingPayment)
        {
            throw new ConflictException($"Order is '{order.Status}' and cannot be paid.");
        }

        await EnsureSeatHeldAsync(order.ApplicationId, now, cancellationToken);

        var attempt = new PaymentAttempt
        {
            SalesOrderId = order.Id,
            Amount = order.AmountDue,
            Currency = order.Currency,
            Provider = _gateway.ProviderName,
            IdempotencyKey = idempotencyKey,
            Status = PaymentAttemptStatuses.Initiated,
            CreatedAt = now
        };
        _context.PaymentAttempts.Add(attempt);
        await _context.SaveChangesAsync(cancellationToken);

        // Phase 2: provider call happens outside any database transaction.
        var charge = await _gateway.ChargeAsync(
            new GatewayChargeRequest(attempt.Id, attempt.Amount, attempt.Currency, idempotencyKey, request.Outcome),
            cancellationToken);

        // Phase 3: settle atomically. Concurrent settlements of the same order fail on SalesOrder.RowVersion.
        return await SettleAsync(order, attempt, charge, cancellationToken);
    }

    public async Task<IReadOnlyList<OrderDto>> GetForLearnerAsync(Guid learnerId, CancellationToken cancellationToken = default)
    {
        return await _context.SalesOrders
            .AsNoTracking()
            .Where(o => o.Application.LearnerId == learnerId)
            .OrderByDescending(o => o.CreatedAt)
            .Select(PaymentsMappings.ToOrderDto())
            .ToListAsync(cancellationToken);
    }

    public async Task SettleStripePaymentAsync(
        Guid orderId,
        string providerPaymentId,
        string eventId,
        long amountTotalMinor,
        string currency,
        CancellationToken cancellationToken = default)
    {
        var now = _clock.GetUtcNow();
        await using var transaction = await _context.Database.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        var order = await _context.SalesOrders
            .Include(o => o.Application)
            .FirstOrDefaultAsync(o => o.Id == orderId, cancellationToken)
            ?? throw new NotFoundException("Sales order not found.");

        if (order.Status == OrderStatuses.Paid)
        {
            await transaction.CommitAsync(cancellationToken);
            return;
        }

        if (await _context.PaymentAttempts.AnyAsync(
            a => a.Provider == StripeWebhookService.Provider && a.ProviderPaymentId == providerPaymentId,
            cancellationToken))
        {
            await transaction.CommitAsync(cancellationToken);
            return;
        }

        if (order.Status != OrderStatuses.PendingPayment)
        {
            throw new ConflictException(
                $"Stripe payment {providerPaymentId} was received but order is '{order.Status}' and cannot be settled; it needs a manual refund or review.");
        }

        var expectedAmountMinor = decimal.ToInt64(decimal.Round(order.AmountDue * 100, 0));
        if (amountTotalMinor != expectedAmountMinor
            || !string.Equals(order.Currency, currency, StringComparison.OrdinalIgnoreCase))
        {
            throw new ConflictException(
                $"Stripe amount or currency ({amountTotalMinor} {currency.ToUpperInvariant()} minor units) does not match the sales order ({expectedAmountMinor} {order.Currency}).");
        }

        // The money has already been taken, so a hold that lapsed during checkout is still honoured
        // as long as the seat was not given away in the meantime.
        var reservation = await _context.SeatReservations
            .FirstOrDefaultAsync(r => r.ApplicationId == order.ApplicationId, cancellationToken);
        if (reservation is not { Status: ReservationStatuses.Held })
        {
            throw new ConflictException(
                $"Stripe payment {providerPaymentId} was received but the seat is no longer reserved; it needs a manual refund or review.");
        }

        if (reservation.ExpiresAt <= now)
        {
            await _capacity.EnsureLapsedHoldCanConvertAsync(reservation.Id, now, cancellationToken);
        }

        var attempt = new PaymentAttempt
        {
            SalesOrderId = order.Id,
            Amount = order.AmountDue,
            Currency = order.Currency,
            Provider = StripeWebhookService.Provider,
            ProviderPaymentId = providerPaymentId,
            IdempotencyKey = $"stripe:{eventId}",
            Status = PaymentAttemptStatuses.Succeeded,
            CreatedAt = now,
            SettledAt = now
        };
        _context.PaymentAttempts.Add(attempt);

        order.Status = OrderStatuses.Paid;
        order.Application.Status = ApplicationStatuses.Accepted;
        reservation.Status = ReservationStatuses.Converted;

        await _enrollments.StageFulfillmentAsync(order.Application, now, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        _logger.LogInformation("Stripe payment {PaymentId} settled order {OrderId} from event {EventId}",
            providerPaymentId, order.Id, eventId);
    }

    private async Task<PaymentResultDto> SettleAsync(
        SalesOrder order, PaymentAttempt attempt, GatewayChargeResult charge, CancellationToken cancellationToken)
    {
        var now = _clock.GetUtcNow();
        Guid? enrollmentId = null;

        await using var transaction = await _context.Database.BeginTransactionAsync(IsolationLevel.ReadCommitted, cancellationToken);

        attempt.ProviderPaymentId = charge.ProviderPaymentId;
        attempt.SettledAt = now;

        if (charge.Succeeded)
        {
            attempt.Status = PaymentAttemptStatuses.Succeeded;
            order.Status = OrderStatuses.Paid;

            var application = await _context.Applications.FirstAsync(a => a.Id == order.ApplicationId, cancellationToken);
            application.Status = ApplicationStatuses.Accepted;

            var reservation = await _context.SeatReservations.FirstAsync(r => r.ApplicationId == application.Id, cancellationToken);
            reservation.Status = ReservationStatuses.Converted;

            var enrollment = await _enrollments.StageFulfillmentAsync(application, now, cancellationToken);
            enrollmentId = enrollment.Id;
        }
        else
        {
            attempt.Status = PaymentAttemptStatuses.Failed;
        }

        await _context.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        _logger.LogInformation("Payment attempt {AttemptId} for order {OrderId} settled as {Status}",
            attempt.Id, order.Id, attempt.Status);

        return new PaymentResultDto(order.Id, order.Status, attempt.ToDto(), enrollmentId);
    }

    private async Task<PaymentResultDto?> FindReplayAsync(Guid learnerId, Guid orderId, string idempotencyKey, CancellationToken cancellationToken)
    {
        var previous = await _context.PaymentAttempts
            .AsNoTracking()
            .Where(pa => pa.IdempotencyKey == idempotencyKey)
            .Select(pa => new
            {
                Attempt = pa,
                pa.SalesOrder.Status,
                pa.SalesOrder.ApplicationId,
                pa.SalesOrder.Application.LearnerId
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (previous is null)
        {
            return null;
        }

        if (previous.LearnerId != learnerId || previous.Attempt.SalesOrderId != orderId)
        {
            throw new ConflictException("This Idempotency-Key was already used for a different request.");
        }

        var enrollmentId = await _context.Enrollments
            .Where(e => e.ApplicationId == previous.ApplicationId)
            .Select(e => (Guid?)e.Id)
            .FirstOrDefaultAsync(cancellationToken);

        return new PaymentResultDto(orderId, previous.Status, previous.Attempt.ToDto(),
            previous.Attempt.Status == PaymentAttemptStatuses.Succeeded ? enrollmentId : null);
    }

    private async Task<SalesOrder> LoadOwnedOrderAsync(Guid learnerId, Guid orderId, CancellationToken cancellationToken) =>
        await _context.SalesOrders
            .FirstOrDefaultAsync(o => o.Id == orderId && o.Application.LearnerId == learnerId, cancellationToken)
        ?? throw new NotFoundException("Order not found.");

    /// <summary>Rejects payment when the seat hold has lapsed, releasing it so capacity is freed.</summary>
    private async Task EnsureSeatHeldAsync(Guid applicationId, DateTimeOffset now, CancellationToken cancellationToken)
    {
        var reservation = await _context.SeatReservations
            .FirstOrDefaultAsync(r => r.ApplicationId == applicationId, cancellationToken);

        if (reservation is { Status: ReservationStatuses.Held } && reservation.ExpiresAt > now)
        {
            return;
        }

        if (reservation is { Status: ReservationStatuses.Held })
        {
            reservation.Status = ReservationStatuses.Released;
            var application = await _context.Applications.FirstAsync(a => a.Id == applicationId, cancellationToken);
            application.Status = ApplicationStatuses.Expired;
            await _context.SalesOrders
                .Where(o => o.ApplicationId == applicationId && o.Status == OrderStatuses.PendingPayment)
                .ExecuteUpdateAsync(s => s.SetProperty(o => o.Status, OrderStatuses.Cancelled), cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        throw new ConflictException("The seat hold for this application has expired. Please apply again.");
    }

    private async Task<OrderDto> GetOrderAsync(Guid orderId, CancellationToken cancellationToken) =>
        await _context.SalesOrders
            .AsNoTracking()
            .Where(o => o.Id == orderId)
            .Select(PaymentsMappings.ToOrderDto())
            .FirstAsync(cancellationToken);
}
