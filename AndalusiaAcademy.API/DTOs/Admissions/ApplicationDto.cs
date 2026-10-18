namespace AndalusiaAcademy.API.DTOs.Admissions;

public class ApplicationDto
{
    public Guid Id { get; set; }
    public Guid OfferingId { get; set; }
    public string OfferingKind { get; set; } = string.Empty;
    public Guid ItemId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTimeOffset SubmittedAt { get; set; }
    public Guid? SalesOrderId { get; set; }
    public decimal AmountDue { get; set; }
    public string Currency { get; set; } = "USD";
    public string OrderStatus { get; set; } = string.Empty;
}
