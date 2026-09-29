using Microsoft.Extensions.Caching.Memory;
using AndalusiaAcademy.API.Common;
using AndalusiaAcademy.API.DTOs.Catalog;
using AndalusiaAcademy.API.Repositories.Interfaces;
using AndalusiaAcademy.API.Services.Interfaces.Catalog;

namespace AndalusiaAcademy.API.Services.Implementations.Catalog;


public class CachedCatalogService : ICatalogService
{
    private readonly ICourseRepository _repository;
    private readonly IMemoryCache _cache;
    private readonly ILogger<CachedCatalogService> _logger;
    private static readonly TimeSpan CacheTtl = TimeSpan.FromMinutes(5);

    public CachedCatalogService(
        ICourseRepository repository,
        IMemoryCache cache,
        ILogger<CachedCatalogService> logger)
    {
        _repository = repository;
        _cache = cache;
        _logger = logger;
    }

    public async Task<PagedResult<CourseSummaryDto>> GetCoursesAsync(
        CatalogQueryParameters query,
        CancellationToken cancellationToken = default)
    {
        var normalizedTerm = query.SearchTerm?.Trim().ToLowerInvariant() ?? string.Empty;
        var cacheKey = $"catalog:courses:q={normalizedTerm}:cat={query.CategoryId}:p={query.PageNumber}:s={query.PageSize}";

        if (_cache.TryGetValue(cacheKey, out PagedResult<CourseSummaryDto>? cachedResult) && cachedResult != null)
        {
            _logger.LogDebug("Cache HIT for key: {CacheKey}", cacheKey);
            return cachedResult;
        }

        _logger.LogDebug("Cache MISS for key: {CacheKey}. Fetching from SQL Server.", cacheKey);

        var result = await _repository.GetCatalogCoursesAsync(query, cancellationToken);

        var cacheEntryOptions = new MemoryCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = CacheTtl,
            Size = 1 // Support sizing limits if enabled
        };

        _cache.Set(cacheKey, result, cacheEntryOptions);

        return result;
    }
}
