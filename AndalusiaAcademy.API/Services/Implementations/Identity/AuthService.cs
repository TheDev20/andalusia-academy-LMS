using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using AndalusiaAcademy.API.Data;
using AndalusiaAcademy.API.Data.Seed;
using AndalusiaAcademy.API.DTOs.Identity;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.API.Exceptions;
using AndalusiaAcademy.API.Models.Identity;
using AndalusiaAcademy.API.Services.Interfaces.Identity;

namespace AndalusiaAcademy.API.Services.Implementations.Identity;

public sealed class AuthService : IAuthService
{
    private const string ForgotPasswordMessage =
        "If an account exists for that e-mail, password reset instructions have been sent.";

    private readonly ApplicationDbContext _context;
    private readonly IPasswordHasher<AppUser> _hasher;
    private readonly UserSessionFactory _sessions;
    private readonly IPasswordResetNotifier _resetNotifier;
    private readonly IdentityOptions _options;
    private readonly TimeProvider _clock;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        ApplicationDbContext context,
        IPasswordHasher<AppUser> hasher,
        UserSessionFactory sessions,
        IPasswordResetNotifier resetNotifier,
        IOptions<IdentityOptions> options,
        TimeProvider clock,
        ILogger<AuthService> logger)
    {
        _context = context;
        _hasher = hasher;
        _sessions = sessions;
        _resetNotifier = resetNotifier;
        _options = options.Value;
        _clock = clock;
        _logger = logger;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default)
    {
        var email = NormalizeEmail(request.Email);
        if (await _context.AppUsers.AnyAsync(u => u.Email == email, cancellationToken))
        {
            throw new ConflictException("An account with this e-mail already exists.");
        }

        var user = new AppUser
        {
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Email = email,
            PhoneNumber = string.IsNullOrWhiteSpace(request.PhoneNumber) ? null : request.PhoneNumber.Trim(),
            CountryCode = string.IsNullOrWhiteSpace(request.CountryCode) ? "EG" : request.CountryCode.Trim().ToUpperInvariant(),
            PreferredLanguage = string.IsNullOrWhiteSpace(request.PreferredLanguage) ? "ar" : request.PreferredLanguage.Trim(),
            CreatedAt = _clock.GetUtcNow()
        };
        user.PasswordHash = _hasher.HashPassword(user, request.Password);
        user.UserRoles.Add(new UserRole { UserId = user.Id, RoleId = IdentitySeedData.RoleIdFor(AppRoles.Learner) });

        _context.AppUsers.Add(user);
        // The unique e-mail index is the real guard against concurrent registrations (mapped to 409).
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Learner account {UserId} registered", user.Id);
        return await _sessions.CreateAsync(user, cancellationToken);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        var email = NormalizeEmail(request.Email);
        var user = await _context.AppUsers.FirstOrDefaultAsync(u => u.Email == email, cancellationToken);

        if (user is null)
        {
            // Burn comparable CPU time so response timing does not reveal whether the account exists.
            _hasher.VerifyHashedPassword(new AppUser(), DummyHash.Value, request.Password);
            throw new UnauthorizedException("Invalid e-mail or password.");
        }

        var result = _hasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (result == PasswordVerificationResult.Failed)
        {
            _logger.LogInformation("Failed login for user {UserId}", user.Id);
            throw new UnauthorizedException("Invalid e-mail or password.");
        }

        if (!user.IsActive)
        {
            throw new ForbiddenException("This account has been deactivated.");
        }

        if (result == PasswordVerificationResult.SuccessRehashNeeded)
        {
            user.PasswordHash = _hasher.HashPassword(user, request.Password);
            await _context.SaveChangesAsync(cancellationToken);
        }

        return await _sessions.CreateAsync(user, cancellationToken);
    }

    public async Task LogoutAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var user = await _context.AppUsers.FirstOrDefaultAsync(u => u.Id == userId, cancellationToken)
            ?? throw new NotFoundException("User not found.");

        user.SecurityStamp = NewSecurityStamp();
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<ForgotPasswordResponse> ForgotPasswordAsync(ForgotPasswordRequest request, CancellationToken cancellationToken = default)
    {
        var email = NormalizeEmail(request.Email);
        var user = await _context.AppUsers.FirstOrDefaultAsync(u => u.Email == email && u.IsActive, cancellationToken);
        if (user is null)
        {
            return new ForgotPasswordResponse(ForgotPasswordMessage, null);
        }

        var now = _clock.GetUtcNow();

        // Only the newest token is valid: invalidate outstanding ones.
        await _context.PasswordResetTokens
            .Where(t => t.UserId == user.Id && t.UsedAt == null && t.ExpiresAt > now)
            .ExecuteUpdateAsync(s => s.SetProperty(t => t.UsedAt, now), cancellationToken);

        var rawToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32))
            .TrimEnd('=').Replace('+', '-').Replace('/', '_');
        var expiresAt = now.AddMinutes(_options.PasswordResetTokenMinutes);

        _context.PasswordResetTokens.Add(new PasswordResetToken
        {
            UserId = user.Id,
            TokenHash = HashToken(rawToken),
            CreatedAt = now,
            ExpiresAt = expiresAt
        });
        _resetNotifier.Enqueue(user, rawToken, expiresAt);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Password reset requested for user {UserId}", user.Id);
        return new ForgotPasswordResponse(ForgotPasswordMessage, _options.ExposeResetTokenInResponse ? rawToken : null);
    }

    public async Task ResetPasswordAsync(ResetPasswordRequest request, CancellationToken cancellationToken = default)
    {
        var email = NormalizeEmail(request.Email);
        var now = _clock.GetUtcNow();
        var tokenHash = HashToken(request.Token.Trim());

        var token = await _context.PasswordResetTokens
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.TokenHash == tokenHash && t.User.Email == email, cancellationToken);

        if (token is null || token.UsedAt is not null || token.ExpiresAt <= now || !token.User.IsActive)
        {
            throw new BusinessRuleException("The reset token is invalid or has expired.");
        }

        token.UsedAt = now;
        token.User.PasswordHash = _hasher.HashPassword(token.User, request.NewPassword);
        token.User.SecurityStamp = NewSecurityStamp();
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Password reset completed for user {UserId}", token.UserId);
    }

    internal static string NormalizeEmail(string email) => email.Trim().ToLowerInvariant();

    internal static string NewSecurityStamp() => Guid.NewGuid().ToString("N");

    internal static string HashToken(string rawToken) =>
        Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(rawToken)));

    private static class DummyHash
    {
        public static readonly string Value =
            new PasswordHasher<AppUser>().HashPassword(new AppUser(), Guid.NewGuid().ToString());
    }
}
