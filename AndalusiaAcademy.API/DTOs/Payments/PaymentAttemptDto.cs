namespace AndalusiaAcademy.API.DTOs.Payments;

public class PaymentAttemptDto
{
    public Guid Id { get; set; }
    public Guid SalesOrderId { get; set; }
    public Guid ApplicationId { get; set; }
    public string Title { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "USD";
    public string Provider { get; set; } = string.Empty;
    public string? ProviderPaymentId { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? SettledAt { get; set; }
}
