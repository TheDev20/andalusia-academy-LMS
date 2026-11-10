using System.Globalization;
using System.Security.Cryptography;
using System.Text;

namespace AndalusiaAcademy.API.Services.Implementations.Payments;

/// <summary>
/// Verifies the <c>Stripe-Signature</c> header: <c>t=&lt;unix seconds&gt;,v1=&lt;hex HMAC-SHA256 of "t.payload"&gt;</c>.
/// Several <c>v1</c> entries may be present while a signing secret is being rolled.
/// </summary>
public static class StripeSignatureVerifier
{
    /// <summary>Stripe's recommended replay window.</summary>
    public static readonly TimeSpan DefaultTolerance = TimeSpan.FromMinutes(5);

    public static bool IsValid(string payload, string? signatureHeader, string secret, DateTimeOffset now, TimeSpan? tolerance = null)
    {
        if (string.IsNullOrWhiteSpace(signatureHeader) || string.IsNullOrWhiteSpace(secret))
        {
            return false;
        }

        string? timestamp = null;
        var signatures = new List<string>();
        foreach (var part in signatureHeader.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
        {
            var separator = part.IndexOf('=');
            if (separator <= 0)
            {
                continue;
            }

            var value = part[(separator + 1)..];
            switch (part[..separator])
            {
                case "t":
                    timestamp = value;
                    break;
                case "v1":
                    signatures.Add(value);
                    break;
            }
        }

        if (!long.TryParse(timestamp, NumberStyles.None, CultureInfo.InvariantCulture, out var unixSeconds)
            || signatures.Count == 0
            || Math.Abs(now.ToUnixTimeSeconds() - unixSeconds) > (long)(tolerance ?? DefaultTolerance).TotalSeconds)
        {
            return false;
        }

        var expected = HMACSHA256.HashData(Encoding.UTF8.GetBytes(secret), Encoding.UTF8.GetBytes($"{timestamp}.{payload}"));
        var matched = false;
        foreach (var signature in signatures)
        {
            byte[] candidate;
            try
            {
                candidate = Convert.FromHexString(signature);
            }
            catch (FormatException)
            {
                continue;
            }

            // No early exit: every candidate is compared in constant time.
            matched |= CryptographicOperations.FixedTimeEquals(expected, candidate);
        }

        return matched;
    }
}
