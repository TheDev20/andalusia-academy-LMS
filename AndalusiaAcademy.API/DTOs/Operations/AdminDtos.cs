using System.ComponentModel.DataAnnotations;
using AndalusiaAcademy.API.DTOs.Identity;

namespace AndalusiaAcademy.API.DTOs.Operations;

/// <summary>Common paging/search parameters for admin listings.</summary>
public class AdminListQuery
{
    private const int MaxPageSize = 100;
    private int _pageSize = 20;

    [StringLength(200)]
    public string? Search { get; set; }

    [Range(1, int.MaxValue)]
    public int PageNumber { get; set; } = 1;

    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = Math.Clamp(value, 1, MaxPageSize);
    }
}

public sealed class AdminUserQuery : AdminListQuery
{
    [RegularExpression("^(Learner|Instructor|Admin|ContentManager)$")]
    public string? Role { get; set; }
}

public sealed record AdminUserDto(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    string? PhoneNumber,
    bool IsActive,
    DateTimeOffset CreatedAt,
    IReadOnlyList<string> Roles);

public sealed record CreateInstructorRequest(
    [Required, StringLength(100, MinimumLength = 1)] string FirstName,
    [Required, StringLength(100, MinimumLength = 1)] string LastName,
    [Required, EmailAddress, StringLength(256)] string Email,
    [Required, StringLength(128, MinimumLength = PasswordRules.MinLength)] string TemporaryPassword,
    [StringLength(4000)] string? Biography);

public sealed record SetUserStatusRequest([Required] bool IsActive);

public sealed record SetUserRolesRequest(
    [Required, MinLength(1)] IReadOnlyList<string> Roles);

public sealed record AdminCourseDto(
    Guid Id,
    string Title,
    string Slug,
    string Description,
    string PublicationStatus,
    int OfferingCount,
    Guid? CategoryId = null,
    string? CategoryName = null,
    string? ImageUrl = null);

public sealed record UpsertCourseRequest(
    [Required, StringLength(250, MinimumLength = 1)] string Title,
    [Required, StringLength(160, MinimumLength = 1), RegularExpression("^[a-z0-9]+(?:-[a-z0-9]+)*$", ErrorMessage = "Slug must be lowercase kebab-case.")] string Slug,
    [Required, StringLength(8000)] string Description,
    [Required, RegularExpression("^(Draft|Published|Archived)$")] string PublicationStatus,
    Guid? CategoryId = null,
    [StringLength(2000)] string? ImageUrl = null);

public sealed record UploadImageResponse(string Url);

public sealed record AdminOfferingDto(
    Guid Id,
    Guid CourseId,
    string CourseTitle,
    DateTimeOffset StartsAt,
    DateTimeOffset EndsAt,
    string TimeZoneId,
    decimal Price,
    string Currency,
    int Capacity,
    int SeatsTaken,
    string Status,
    IReadOnlyList<OfferingInstructorDto> Instructors);

public sealed record OfferingInstructorDto(Guid InstructorId, string Name, string Email);

public sealed record UpsertOfferingRequest(
    [Required] Guid CourseId,
    [Required] DateTimeOffset StartsAt,
    [Required] DateTimeOffset EndsAt,
    [Required, StringLength(100)] string TimeZoneId,
    [Range(typeof(decimal), "0", "1000000")] decimal Price,
    [Required, StringLength(3, MinimumLength = 3)] string Currency,
    [Range(1, 10000)] int Capacity,
    [Required, RegularExpression("^(Planned|Published|Closed|Cancelled)$")] string Status);

public sealed record AssignInstructorRequest([Required] Guid InstructorId);

public sealed record AdminResourceDto(Guid Id, Guid CourseOfferingId, string Title, string? Url, bool Required, int Sequence);

public sealed record UpsertResourceRequest(
    [Required, StringLength(250, MinimumLength = 1)] string Title,
    [Url, StringLength(1000)] string? Url,
    bool Required,
    [Range(0, 10000)] int Sequence);

public sealed record AdminLocationDto(Guid Id, string Name, string? Address, string? MeetingUrl);

public sealed record UpsertLocationRequest(
    [Required, StringLength(200, MinimumLength = 1)] string Name,
    [StringLength(500)] string? Address,
    [Url, StringLength(1000)] string? MeetingUrl);

public sealed record AdminSessionDto(
    Guid Id,
    Guid CourseOfferingId,
    string Title,
    DateTimeOffset StartsAt,
    DateTimeOffset EndsAt,
    string Status,
    Guid? LocationId,
    string? LocationName);

public sealed record UpsertSessionRequest(
    [Required, StringLength(250, MinimumLength = 1)] string Title,
    [Required] DateTimeOffset StartsAt,
    [Required] DateTimeOffset EndsAt,
    Guid? LocationId,
    [Required, RegularExpression("^(Scheduled|Completed|Cancelled)$")] string Status);

public sealed class AdminOrderQuery : AdminListQuery
{
    [RegularExpression("^(PendingPayment|Paid|Cancelled)$")]
    public string? Status { get; set; }
}

public sealed record AdminOrderDto(
    Guid Id,
    Guid ApplicationId,
    Guid LearnerId,
    string LearnerEmail,
    string Title,
    decimal AmountDue,
    string Currency,
    string Status,
    DateTimeOffset CreatedAt,
    int AttemptCount,
    DateTimeOffset? PaidAt);
