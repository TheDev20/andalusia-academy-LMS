using Microsoft.Extensions.Primitives;

namespace AndalusiaAcademy.API.Services.Implementations.Catalog;

/// <summary>
/// Evicts every cached catalog entry at once. Entries carry the current change token; administrative
/// writes call <see cref="Invalidate"/> so public pages reflect edits immediately instead of after the TTL.
/// Single-instance only: a scaled-out deployment needs a distributed cache or backplane.
/// </summary>
public sealed class CatalogCacheInvalidator
{
    private CancellationTokenSource _source = new();

    public IChangeToken CurrentToken => new CancellationChangeToken(Volatile.Read(ref _source).Token);

    public void Invalidate()
    {
        var previous = Interlocked.Exchange(ref _source, new CancellationTokenSource());
        previous.Cancel();
        previous.Dispose();
    }
}
