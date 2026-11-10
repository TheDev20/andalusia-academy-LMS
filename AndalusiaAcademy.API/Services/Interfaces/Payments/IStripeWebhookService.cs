namespace AndalusiaAcademy.API.Services.Interfaces.Payments;

public enum StripeWebhookOutcome
{
    /// <summary>The event was handled (or had already been handled) and can be acknowledged.</summary>
    Acknowledged,

    /// <summary>The signature header is missing, stale or does not match the payload.</summary>
    InvalidSignature,

    /// <summary>No webhook signing secret is configured, so no event can be trusted.</summary>
    NotConfigured
}

/// <summary>
/// Verifies and processes Stripe webhook deliveries. Every verified event is recorded in the webhook
/// inbox; processing is idempotent per event, so Stripe redeliveries are safe.
/// </summary>
public interface IStripeWebhookService
{
    /// <summary>
    /// Handles one delivery. Processing failures are recorded on the inbox entry and rethrown so the
    /// caller answers with a non-2xx status and Stripe redelivers.
    /// </summary>
    Task<StripeWebhookOutcome> HandleAsync(string payload, string? signatureHeader, CancellationToken cancellationToken = default);
}
