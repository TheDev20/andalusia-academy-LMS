using System.ComponentModel.DataAnnotations;

namespace AndalusiaAcademy.API.DTOs.Admissions;

public sealed record CreateApplicationRequest([Required] Guid OfferingId);

public sealed record ApplicationDto(
    Guid Id,
    Guid OfferingId,
    string OfferingKind,
    string Title,
    DateTimeOffset StartsAt,
    DateTimeOffset EndsAt,
    decimal Price,
    string Currency,
    string Status,
    DateTimeOffset? SubmittedAt,
    DateTimeOffset? SeatHeldUntil,
    Guid? OrderId,
    string? OrderStatus,
    Guid? EnrollmentId);

public sealed record EnrollmentDto(
    Guid Id,
    Guid ApplicationId,
    Guid OfferingId,
    string OfferingKind,
    string Title,
    DateTimeOffset StartsAt,
    DateTimeOffset EndsAt,
    string Status,
    DateTimeOffset EnrolledAt,
    IReadOnlyList<LearningEnrollmentSummaryDto> Courses);

public sealed record LearningEnrollmentSummaryDto(
    Guid LearningEnrollmentId,
    Guid CourseOfferingId,
    string CourseTitle,
    string Status);
