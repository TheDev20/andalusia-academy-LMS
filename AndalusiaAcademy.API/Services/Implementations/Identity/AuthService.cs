using Microsoft.Extensions.Caching.Memory;
using AndalusiaAcademy.API.DTOs.Identity;
using AndalusiaAcademy.API.Exceptions;
using AndalusiaAcademy.API.Models.Identity;
using AndalusiaAcademy.API.Repositories.Interfaces;
using AndalusiaAcademy.API.Services.Interfaces.Identity;

namespace AndalusiaAcademy.API.Services.Implementations.Identity;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasherService _hasher;
    private readonly IJwtTokenGenerator _jwt;
    private readonly IMemoryCache _cache;
    private static readonly TimeSpan ProfileCacheDuration = TimeSpan.FromMinutes(5);

    public AuthService(
        IUserRepository userRepository,
        IPasswordHasherService hasher,
        IJwtTokenGenerator jwt,
        IMemoryCache cache)
    {
        _userRepository = userRepository;
        _hasher = hasher;
        _jwt = jwt;
        _cache = cache;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        if (await _userRepository.ExistsByEmailAsync(normalizedEmail))
        {
            throw new ConflictException("An account with this email address already exists.");
        }

        var learnerRole = await _userRepository.GetRoleByNameAsync("Learner");
        if (learnerRole == null)
        {
            learnerRole = new Role { Name = "Learner", Description = "Default learner role" };
        }

        var user = new AppUser
        {
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Email = normalizedEmail,
            PasswordHash = _hasher.HashPassword(request.Password),
            PhoneNumber = request.PhoneNumber,
            CountryCode = request.CountryCode,
            PreferredLanguage = request.PreferredLanguage
        };

        user.UserRoles.Add(new UserRole { User = user, Role = learnerRole });

        await _userRepository.CreateAsync(user);

        var roles = new List<string> { learnerRole.Name };
        var (token, expiresAt) = _jwt.GenerateToken(user, roles);

        return new AuthResponse
        {
            Token = token,
            ExpiresAt = expiresAt,
            UserId = user.Id,
            Email = user.Email,
            FullName = $"{user.FirstName} {user.LastName}",
            Roles = roles
        };
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var user = await _userRepository.GetByEmailWithRolesAsync(normalizedEmail);

        if (user == null || !_hasher.VerifyPassword(request.Password, user.PasswordHash))
        {
            throw new NotFoundException("Invalid email address or password.");
        }

        var roles = user.UserRoles.Select(ur => ur.Role.Name).ToList();
        var (token, expiresAt) = _jwt.GenerateToken(user, roles);

        return new AuthResponse
        {
            Token = token,
            ExpiresAt = expiresAt,
            UserId = user.Id,
            Email = user.Email,
            FullName = $"{user.FirstName} {user.LastName}",
            Roles = roles
        };
    }

    public async Task<UserProfileDto> GetProfileAsync(Guid userId)
    {
        var cacheKey = $"auth:profile:{userId}";
        if (_cache.TryGetValue(cacheKey, out UserProfileDto? cached) && cached != null)
        {
            return cached;
        }

        var user = await _userRepository.GetByIdWithRolesAsync(userId);
        if (user == null)
        {
            throw new NotFoundException("User profile not found.");
        }

        var roles = user.UserRoles.Select(ur => ur.Role.Name).ToList();

        var profile = new UserProfileDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            CountryCode = user.CountryCode,
            PreferredLanguage = user.PreferredLanguage,
            Roles = roles,
            CreatedAt = user.CreatedAt
        };

        _cache.Set(cacheKey, profile, ProfileCacheDuration);
        return profile;
    }
}