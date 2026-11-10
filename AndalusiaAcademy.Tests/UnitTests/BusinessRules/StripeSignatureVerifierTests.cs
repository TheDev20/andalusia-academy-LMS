using System.Security.Cryptography;
using System.Text;
using AndalusiaAcademy.API.Services.Implementations.Payments;

namespace AndalusiaAcademy.Tests.UnitTests.BusinessRules;

public class StripeSignatureVerifierTests
{
    private const string Secret = "whsec_unit_test_secret";
    private const string Payload = "{\"id\":\"evt_1\",\"type\":\"checkout.session.completed\"}";
    private static readonly DateTimeOffset Now = new(2026, 11, 1, 12, 0, 0, TimeSpan.Zero);

    [Fact]
    public void Accepts_a_fresh_signature_made_with_the_configured_secret()
    {
        Assert.True(StripeSignatureVerifier.IsValid(Payload, Header(Now, Sign(Payload, Now, Secret)), Secret, Now));
    }

    [Fact]
    public void Accepts_any_matching_v1_entry_during_secret_rotation()
    {
        var header = $"t={Now.ToUnixTimeSeconds()},v1={Sign(Payload, Now, "whsec_previous")},v1={Sign(Payload, Now, Secret)},v0=ignored";

        Assert.True(StripeSignatureVerifier.IsValid(Payload, header, Secret, Now));
    }

    [Fact]
    public void Rejects_a_signature_made_with_another_secret()
    {
        Assert.False(StripeSignatureVerifier.IsValid(Payload, Header(Now, Sign(Payload, Now, "whsec_other")), Secret, Now));
    }

    [Fact]
    public void Rejects_a_payload_that_changed_after_signing()
    {
        Assert.False(StripeSignatureVerifier.IsValid(Payload + " ", Header(Now, Sign(Payload, Now, Secret)), Secret, Now));
    }

    [Theory]
    [InlineData(-301)]
    [InlineData(301)]
    public void Rejects_timestamps_outside_the_tolerance_window(int offsetSeconds)
    {
        var signedAt = Now.AddSeconds(offsetSeconds);

        Assert.False(StripeSignatureVerifier.IsValid(Payload, Header(signedAt, Sign(Payload, signedAt, Secret)), Secret, Now));
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("garbage")]
    [InlineData("t=,v1=")]
    [InlineData("t=1793534400")]
    [InlineData("v1=abcdef")]
    [InlineData("t=1793534400,v1=not-hex")]
    public void Rejects_missing_or_malformed_headers(string? header)
    {
        Assert.False(StripeSignatureVerifier.IsValid(Payload, header, Secret, Now));
    }

    [Fact]
    public void Rejects_everything_when_no_secret_is_configured()
    {
        Assert.False(StripeSignatureVerifier.IsValid(Payload, Header(Now, Sign(Payload, Now, string.Empty)), string.Empty, Now));
    }

    private static string Header(DateTimeOffset signedAt, string signature) => $"t={signedAt.ToUnixTimeSeconds()},v1={signature}";

    private static string Sign(string payload, DateTimeOffset signedAt, string secret) =>
        Convert.ToHexString(HMACSHA256.HashData(
            Encoding.UTF8.GetBytes(secret),
            Encoding.UTF8.GetBytes($"{signedAt.ToUnixTimeSeconds()}.{payload}"))).ToLowerInvariant();
}
