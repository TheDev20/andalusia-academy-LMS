using AndalusiaAcademy.API.DTOs.Payments;

namespace AndalusiaAcademy.API.Services.Interfaces.Payments;

public interface IPaymentService
{
    /// <summary>Creates (or returns the existing) sales order for a submitted application.</summary>
    Task<OrderDto> CreateOrderAsync(Guid learnerId, CreateOrderRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Runs a simulated payment. Replaying the same idempotency key returns the original result.
    /// A successful payment accepts the application and creates the enrollment atomically.
    /// </summary>
    Task<PaymentResultDto> PayWithSimulationAsync(
        Guid learnerId, Guid orderId, SimulatePaymentRequest request, string idempotencyKey, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<OrderDto>> GetForLearnerAsync(Guid learnerId, CancellationToken cancellationToken = default);
}
