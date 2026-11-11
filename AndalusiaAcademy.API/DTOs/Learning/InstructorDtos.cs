using System.ComponentModel.DataAnnotations;
using AndalusiaAcademy.API.DTOs.Common;

namespace AndalusiaAcademy.API.DTOs.Learning;

public sealed record CohortDto(
    Guid OfferingId,
    Guid CourseId,
    string CourseTitle,
    DateTimeOffset StartsAt,
    DateTimeOffset EndsAt,
    string Status,
    int LearnerCount,
    int SessionCount,
    int AssignmentCount);

public sealed record InstructorSessionDto(
    Guid Id,
    string Title,
    DateTimeOffset StartsAt,
    DateTimeOffset EndsAt,
    string Status,
    string? LocationName,
    int AttendanceRecorded);

public sealed record InstructorAssignmentDto(
    Guid Id,
    string Title,
    string Instructions,
    decimal MaxScore,
    DateTimeOffset? DueAt,
    string Status,
    int SubmissionCount,
    int UngradedCount);

public sealed record RosterEntryDto(
    Guid LearningEnrollmentId,
    Guid LearnerId,
    string LearnerName,
    string Email,
    string Status);

public sealed record CohortDetailDto(
    CohortDto Cohort,
    IReadOnlyList<InstructorSessionDto> Sessions,
    IReadOnlyList<InstructorAssignmentDto> Assignments,
    IReadOnlyList<RosterEntryDto> Roster);

public sealed record AttendanceRecordDto(
    Guid LearningEnrollmentId,
    Guid LearnerId,
    string LearnerName,
    string? Status,
    DateTimeOffset? RecordedAt);

public sealed record SessionAttendanceDto(
    Guid SessionId,
    Guid CourseOfferingId,
    string Title,
    DateTimeOffset StartsAt,
    IReadOnlyList<AttendanceRecordDto> Records);

public sealed record AttendanceEntry(
    [Required] Guid LearningEnrollmentId,
    [Required, RegularExpression("^(Present|Absent|Late|Excused)$")] string Status,
    [StringLength(1000)] string? CorrectionReason);

public sealed record RecordAttendanceRequest(
    [Required, MinLength(1), MaxLength(500)] IReadOnlyList<AttendanceEntry> Records);

public sealed record UpsertAssignmentRequest(
    [Required, StringLength(250, MinimumLength = 1)] string Title,
    [Required, StringLength(20000)] string Instructions,
    [Range(typeof(decimal), "0.01", "10000")] decimal MaxScore,
    DateTimeOffset? DueAt,
    [Required, RegularExpression("^(Draft|Published|Closed)$")] string Status);

public sealed record UploadAttachmentResponse(string Url, string FileName, long SizeBytes);

public sealed record SubmissionForGradingDto(
    Guid Id,
    Guid LearningEnrollmentId,
    string LearnerName,
    int AttemptNumber,
    string? Body,
    DateTimeOffset SubmittedAt,
    decimal? Score,
    DateTimeOffset? GradedAt,
    IReadOnlyList<FileDto> Files);

public sealed record GradeSubmissionRequest(
    [Range(typeof(decimal), "0", "10000")] decimal Score);

public sealed record LearnerProgressDto(
    Guid LearningEnrollmentId,
    Guid LearnerId,
    string LearnerName,
    string Email,
    ProgressDto Progress);
