using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.API.Services.Interfaces.Payments;

namespace AndalusiaAcademy.API.Services.Implementations.Payments;

/// <summary>
/// Deterministic stand-in for a hosted checkout: the caller chooses the outcome. Moves no money.
/// </summary>
public sealed class SimulatedPaymentGateway : IPaymentGateway
{
    public string ProviderName => "Simulated";

    public Task<GatewayChargeResult> ChargeAsync(GatewayChargeRequest request, CancellationToken cancellationToken)
    {
        var succeeded = !string.Equals(request.RequestedOutcome, PaymentAttemptStatuses.Failed, StringComparison.OrdinalIgnoreCase);
        var result = new GatewayChargeResult(
            succeeded,
            $"sim_{request.PaymentAttemptId:N}",
            succeeded ? null : "Simulated card decline.");

        return Task.FromResult(result);
    }
}
