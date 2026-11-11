using System.ComponentModel.DataAnnotations;
using AndalusiaAcademy.API.DTOs.Common;

namespace AndalusiaAcademy.API.DTOs.Learning;

public sealed record ProgressDto(
    int RequiredResources,
    int CompletedResources,
    int SessionsHeld,
    int SessionsAttended,
    int Assignments,
    int AssignmentsSubmitted,
    decimal ResourceCompletionPercent,
    decimal AttendancePercent,
    decimal AssignmentCompletionPercent,
    decimal OverallPercent);

public sealed record MyCourseDto(
    Guid LearningEnrollmentId,
    Guid CourseOfferingId,
    Guid CourseId,
    string CourseTitle,
    string CourseSlug,
    string? ImageUrl,
    string? Category,
    DateTimeOffset StartsAt,
    DateTimeOffset EndsAt,
    string Status,
    DateTimeOffset? NextSessionAt,
    ProgressDto Progress);

public sealed record LocationDto(Guid Id, string Name, string? Address, string? MeetingUrl);

public sealed record LearnerSessionDto(
    Guid Id,
    string Title,
    DateTimeOffset StartsAt,
    DateTimeOffset EndsAt,
    string Status,
    LocationDto? Location,
    string? MyAttendance);

public sealed record LearnerResourceDto(
    Guid Id,
    string Title,
    string? Url,
    bool Required,
    int Sequence,
    DateTimeOffset? CompletedAt,
    IReadOnlyList<FileDto> Files);

public sealed record SubmissionDto(
    Guid Id,
    Guid AssignmentId,
    int AttemptNumber,
    string? Body,
    decimal? Score,
    DateTimeOffset SubmittedAt,
    DateTimeOffset? GradedAt,
    IReadOnlyList<FileDto> Files);

public sealed record LearnerAssignmentDto(
    Guid Id,
    string Title,
    string Instructions,
    decimal MaxScore,
    DateTimeOffset? DueAt,
    string Status,
    SubmissionDto? LatestSubmission,
    IReadOnlyList<FileDto> Attachments);

public sealed record CourseLearningDto(
    Guid LearningEnrollmentId,
    Guid CourseOfferingId,
    string CourseTitle,
    string CourseDescription,
    DateTimeOffset StartsAt,
    DateTimeOffset EndsAt,
    string TimeZoneId,
    IReadOnlyList<string> Instructors,
    IReadOnlyList<LearnerSessionDto> Sessions,
    IReadOnlyList<LearnerResourceDto> Resources,
    IReadOnlyList<LearnerAssignmentDto> Assignments,
    ProgressDto Progress);

public sealed record SubmitAssignmentRequest(
    [Required, StringLength(20000, MinimumLength = 1)] string Body);

/// <summary>Multipart submission: optional text plus up to <c>UploadLimits.MaxFilesPerUpload</c> files (at least one of the two).</summary>
public sealed class SubmitAssignmentFormRequest
{
    [StringLength(20000)]
    public string? Body { get; init; }

    public List<IFormFile>? Files { get; init; }
}
