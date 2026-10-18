using AndalusiaAcademy.API.DTOs.Payments;

namespace AndalusiaAcademy.API.Services.Interfaces.Payments;

public interface IPaymentService
{
    Task<PaymentAttemptDto> ProcessPaymentAttemptAsync(Guid learnerId, CreatePaymentAttemptRequest request, CancellationToken ct = default);
    Task<List<PaymentAttemptDto>> GetMyPaymentsAsync(Guid learnerId, CancellationToken ct = default);
}
