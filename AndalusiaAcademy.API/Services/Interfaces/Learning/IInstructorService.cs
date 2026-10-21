using AndalusiaAcademy.API.DTOs.Learning;

namespace AndalusiaAcademy.API.Services.Interfaces.Learning;

/// <summary>
/// Cohort operations for the instructors assigned to a course offering. Admins may act on any cohort.
/// </summary>
public interface IInstructorService
{
    Task<IReadOnlyList<CohortDto>> GetCohortsAsync(CancellationToken cancellationToken = default);
    Task<CohortDetailDto> GetCohortAsync(Guid offeringId, CancellationToken cancellationToken = default);

    Task<SessionAttendanceDto> GetAttendanceAsync(Guid sessionId, CancellationToken cancellationToken = default);
    Task<SessionAttendanceDto> RecordAttendanceAsync(Guid sessionId, RecordAttendanceRequest request, CancellationToken cancellationToken = default);

    Task<InstructorAssignmentDto> CreateAssignmentAsync(Guid offeringId, UpsertAssignmentRequest request, CancellationToken cancellationToken = default);
    Task<InstructorAssignmentDto> UpdateAssignmentAsync(Guid assignmentId, UpsertAssignmentRequest request, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<SubmissionForGradingDto>> GetSubmissionsAsync(Guid assignmentId, CancellationToken cancellationToken = default);
    Task<SubmissionForGradingDto> GradeSubmissionAsync(Guid submissionId, GradeSubmissionRequest request, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<LearnerProgressDto>> GetProgressAsync(Guid offeringId, CancellationToken cancellationToken = default);
}
