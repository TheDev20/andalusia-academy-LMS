using Microsoft.Extensions.Caching.Memory;
using AndalusiaAcademy.API.DTOs.Catalog;
using AndalusiaAcademy.API.DTOs.Common;
using AndalusiaAcademy.API.Repositories.Interfaces;
using AndalusiaAcademy.API.Services.Interfaces.Catalog;

namespace AndalusiaAcademy.API.Services.Implementations.Catalog;

/// <summary>
/// Cached decorator service implementing Level 3 in-memory caching (RFC Option B).
/// Intercepts catalog reads to return sub-millisecond cached responses and protect SQL Server.
/// </summary>
public class CachedCatalogService : ICatalogService
{
    private readonly ICourseRepository _courseRepository;
    private readonly IProgramRepository _programRepository;
    private readonly ICareerPathRepository _careerPathRepository;
    private readonly IMemoryCache _cache;
    private readonly ILogger<CachedCatalogService> _logger;
    private static readonly TimeSpan CacheTtl = TimeSpan.FromMinutes(5);

    public CachedCatalogService(
        ICourseRepository courseRepository,
        IProgramRepository programRepository,
        ICareerPathRepository careerPathRepository,
        IMemoryCache cache,
        ILogger<CachedCatalogService> logger)
    {
        _courseRepository = courseRepository;
        _programRepository = programRepository;
        _careerPathRepository = careerPathRepository;
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
        var result = await _courseRepository.GetCatalogCoursesAsync(query, cancellationToken);

        SetCache(cacheKey, result);
        return result;
    }

    public async Task<CourseDetailDto?> GetCourseDetailAsync(
        string idOrSlug,
        CancellationToken cancellationToken = default)
    {
        var normalized = idOrSlug.Trim().ToLowerInvariant();
        var cacheKey = $"catalog:course-detail:{normalized}";

        if (_cache.TryGetValue(cacheKey, out CourseDetailDto? cachedResult))
        {
            _logger.LogDebug("Cache HIT for key: {CacheKey}", cacheKey);
            return cachedResult;
        }

        _logger.LogDebug("Cache MISS for key: {CacheKey}. Fetching from SQL Server.", cacheKey);
        var result = await _courseRepository.GetCourseDetailAsync(idOrSlug, cancellationToken);

        if (result != null)
        {
            SetCache(cacheKey, result);
        }

        return result;
    }

    public async Task<PagedResult<ProgramSummaryDto>> GetProgramsAsync(
        CatalogQueryParameters query,
        CancellationToken cancellationToken = default)
    {
        var normalizedTerm = query.SearchTerm?.Trim().ToLowerInvariant() ?? string.Empty;
        var cacheKey = $"catalog:programs:q={normalizedTerm}:cat={query.CategoryId}:p={query.PageNumber}:s={query.PageSize}";

        if (_cache.TryGetValue(cacheKey, out PagedResult<ProgramSummaryDto>? cachedResult) && cachedResult != null)
        {
            _logger.LogDebug("Cache HIT for key: {CacheKey}", cacheKey);
            return cachedResult;
        }

        _logger.LogDebug("Cache MISS for key: {CacheKey}. Fetching from SQL Server.", cacheKey);
        var result = await _programRepository.GetCatalogProgramsAsync(query, cancellationToken);

        SetCache(cacheKey, result);
        return result;
    }

    public async Task<ProgramDetailDto?> GetProgramDetailAsync(
        string idOrSlug,
        CancellationToken cancellationToken = default)
    {
        var normalized = idOrSlug.Trim().ToLowerInvariant();
        var cacheKey = $"catalog:program-detail:{normalized}";

        if (_cache.TryGetValue(cacheKey, out ProgramDetailDto? cachedResult))
        {
            _logger.LogDebug("Cache HIT for key: {CacheKey}", cacheKey);
            return cachedResult;
        }

        _logger.LogDebug("Cache MISS for key: {CacheKey}. Fetching from SQL Server.", cacheKey);
        var result = await _programRepository.GetProgramDetailAsync(idOrSlug, cancellationToken);

        if (result != null)
        {
            SetCache(cacheKey, result);
        }

        return result;
    }

    public async Task<List<CareerPathSummaryDto>> GetCareerPathsAsync(
        CancellationToken cancellationToken = default)
    {
        const string cacheKey = "catalog:career-paths:all";

        if (_cache.TryGetValue(cacheKey, out List<CareerPathSummaryDto>? cachedResult) && cachedResult != null)
        {
            _logger.LogDebug("Cache HIT for key: {CacheKey}", cacheKey);
            return cachedResult;
        }

        _logger.LogDebug("Cache MISS for key: {CacheKey}. Fetching from SQL Server.", cacheKey);
        var result = await _careerPathRepository.GetCareerPathsAsync(cancellationToken);

        SetCache(cacheKey, result);
        return result;
    }

    public async Task<CareerPathDetailDto?> GetCareerPathDetailAsync(
        string idOrSlug,
        CancellationToken cancellationToken = default)
    {
        var normalized = idOrSlug.Trim().ToLowerInvariant();
        var cacheKey = $"catalog:career-path-detail:{normalized}";

        if (_cache.TryGetValue(cacheKey, out CareerPathDetailDto? cachedResult))
        {
            _logger.LogDebug("Cache HIT for key: {CacheKey}", cacheKey);
            return cachedResult;
        }

        _logger.LogDebug("Cache MISS for key: {CacheKey}. Fetching from SQL Server.", cacheKey);
        var result = await _careerPathRepository.GetCareerPathDetailAsync(idOrSlug, cancellationToken);

        if (result != null)
        {
            SetCache(cacheKey, result);
        }

        return result;
    }

    private void SetCache<T>(string key, T value)
    {
        var cacheEntryOptions = new MemoryCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = CacheTtl,
            Size = 1
        };

        _cache.Set(key, value, cacheEntryOptions);
    }
}
