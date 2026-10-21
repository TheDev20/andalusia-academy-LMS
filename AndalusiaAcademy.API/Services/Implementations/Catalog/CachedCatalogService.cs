using Microsoft.Extensions.Caching.Memory;
using AndalusiaAcademy.API.DTOs.Catalog;
using AndalusiaAcademy.API.DTOs.Common;
using AndalusiaAcademy.API.Repositories.Interfaces;
using AndalusiaAcademy.API.Services.Interfaces.Catalog;

using AndalusiaAcademy.API.Exceptions;
using AndalusiaAcademy.API.Models.Catalog;

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
    private readonly ICategoryRepository _categoryRepository;
    private readonly IMemoryCache _cache;
    private readonly ILogger<CachedCatalogService> _logger;
    private readonly CatalogCacheInvalidator _invalidator;
    private static readonly TimeSpan CacheTtl = TimeSpan.FromMinutes(5);

    public CachedCatalogService(
        ICourseRepository courseRepository,
        IProgramRepository programRepository,
        ICareerPathRepository careerPathRepository,
        ICategoryRepository categoryRepository,
        IMemoryCache cache,
        CatalogCacheInvalidator invalidator,
        ILogger<CachedCatalogService> logger)
    {
        _invalidator = invalidator;
        _courseRepository = courseRepository;
        _programRepository = programRepository;
        _careerPathRepository = careerPathRepository;
        _categoryRepository = categoryRepository;
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

    public async Task<List<TechDisciplineDto>> GetDisciplinesAsync(
        CancellationToken cancellationToken = default)
    {
        const string cacheKey = "catalog:disciplines";

        if (_cache.TryGetValue(cacheKey, out List<TechDisciplineDto>? cachedResult) && cachedResult != null)
        {
            _logger.LogDebug("Cache HIT for key: {CacheKey}", cacheKey);
            return cachedResult;
        }

        _logger.LogDebug("Cache MISS for key: {CacheKey}. Fetching from SQL Server.", cacheKey);
        var result = await _categoryRepository.GetDisciplinesAsync(cancellationToken);

        SetCache(cacheKey, result);
        return result;
    }

    public async Task<TechDisciplineDto> CreateDisciplineAsync(
        CreateTechDisciplineRequest request,
        CancellationToken cancellationToken = default)
    {
        //  exception check global middleware catch conflict 409
        if (await _categoryRepository.ExistsByNameAsync(request.Title, cancellationToken))
        {
            throw new CategoryAlreadyExistsException($"A discipline with title '{request.Title}' already exists.");
        }

        // Prepare entity & persist through Repository
        var slug = request.Title.Trim().ToLowerInvariant().Replace(" ", "-").Replace("&", "and");
        var category = new Category
        {
            Name = request.Title.Trim(),
            Slug = slug,
            Description = request.Description.Trim(),
            Icon = request.Icon
        };

        var created = await _categoryRepository.CreateAsync(category, cancellationToken);

        // remove past so new ones appear 
        _cache.Remove("catalog:disciplines");
        _logger.LogInformation("Cache invalidated for key: catalog:disciplines due to newly added discipline.");

        return new TechDisciplineDto(
            created.Id,
            created.Name,
            created.Slug,
            created.Description,
            created.Icon,
            0,
            "0 Programs"
        );
    }

    public async Task UpdateDisciplineAsync(
        Guid id,
        UpdateTechDisciplineRequest request,
        CancellationToken cancellationToken = default)
    {
        var category = await _categoryRepository.GetByIdAsync(id, cancellationToken);
        if (category == null)
        {
            throw new NotFoundException($"Discipline with id '{id}' was not found.");
        }

        // If title changed, verify not duplicate
        if (!string.Equals(category.Name, request.Title.Trim(), StringComparison.OrdinalIgnoreCase))
        {
            if (await _categoryRepository.ExistsByNameAsync(request.Title, cancellationToken))
            {
                throw new CategoryAlreadyExistsException($"A discipline with title '{request.Title}' already exists.");
            }
        }

        category.Name = request.Title.Trim();
        category.Slug = request.Title.Trim().ToLowerInvariant().Replace(" ", "-").Replace("&", "and");
        category.Description = request.Description.Trim();
        category.Icon = string.IsNullOrWhiteSpace(request.Icon) ? "Code2" : request.Icon.Trim();

        await _categoryRepository.UpdateAsync(category, cancellationToken);

        // Invalidate on write
        _cache.Remove("catalog:disciplines");
        _logger.LogInformation("Cache invalidated for key: catalog:disciplines due to discipline update (ID: {DisciplineId}).", id);
    }

    private void SetCache<T>(string key, T value)
    {
        var cacheEntryOptions = new MemoryCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = CacheTtl,
            Size = 1
        };
        cacheEntryOptions.AddExpirationToken(_invalidator.CurrentToken);

        _cache.Set(key, value, cacheEntryOptions);
    }
}
