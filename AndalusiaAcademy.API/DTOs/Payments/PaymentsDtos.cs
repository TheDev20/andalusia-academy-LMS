using System.ComponentModel.DataAnnotations;

namespace AndalusiaAcademy.API.DTOs.Payments;

public sealed record CreateOrderRequest([Required] Guid ApplicationId);

public sealed record SimulatePaymentRequest(
    [Required, RegularExpression("^(Succeeded|Failed)$", ErrorMessage = "Outcome must be 'Succeeded' or 'Failed'.")]
    string Outcome);

public sealed record OrderDto(
    Guid Id,
    Guid ApplicationId,
    string Title,
    decimal AmountDue,
    string Currency,
    string Status,
    DateTimeOffset CreatedAt,
    IReadOnlyList<PaymentAttemptDto> Attempts);

public sealed record PaymentAttemptDto(
    Guid Id,
    decimal Amount,
    string Currency,
    string Provider,
    string? ProviderPaymentId,
    string Status,
    DateTimeOffset CreatedAt,
    DateTimeOffset? SettledAt);

public sealed record PaymentResultDto(
    Guid OrderId,
    string OrderStatus,
    PaymentAttemptDto Attempt,
    Guid? EnrollmentId);
