namespace AndalusiaAcademy.API.Services.Interfaces.Payments;

public sealed record GatewayChargeRequest(
    Guid PaymentAttemptId,
    decimal Amount,
    string Currency,
    string IdempotencyKey,
    string? RequestedOutcome);

public sealed record GatewayChargeResult(bool Succeeded, string ProviderPaymentId, string? FailureReason);

/// <summary>
/// Abstraction over the hosted payment provider. Phase 1 ships only the approved simulation.
/// </summary>
public interface IPaymentGateway
{
    string ProviderName { get; }
    Task<GatewayChargeResult> ChargeAsync(GatewayChargeRequest request, CancellationToken cancellationToken);
}
