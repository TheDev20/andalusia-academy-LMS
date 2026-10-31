namespace AndalusiaAcademy.API.Services.Implementations.Payments;

/// <summary>Bound from the "Payments" configuration section.</summary>
public sealed class PaymentOptions
{
    public const string SectionName = "Payments";

    /// <summary>
    /// Enables the approved payment simulation. No real gateway is integrated in Phase 1,
    /// so this must be explicitly enabled per environment.
    /// </summary>
    public bool SimulationEnabled { get; init; }

    public string StripeWebhookSecret { get; init; } = string.Empty;
}
