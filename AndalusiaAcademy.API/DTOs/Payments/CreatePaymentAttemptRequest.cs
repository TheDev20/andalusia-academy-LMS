namespace AndalusiaAcademy.API.DTOs.Payments;

public class CreatePaymentAttemptRequest
{
    public Guid SalesOrderId { get; set; }
    public string Provider { get; set; } = "SimulatedCard";
    public string IdempotencyKey { get; set; } = string.Empty;
}
