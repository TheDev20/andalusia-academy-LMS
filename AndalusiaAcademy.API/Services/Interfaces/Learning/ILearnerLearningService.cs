using AndalusiaAcademy.API.DTOs.Learning;
using AndalusiaAcademy.API.Services.Interfaces.Storage;

namespace AndalusiaAcademy.API.Services.Interfaces.Learning;

/// <summary>
/// Learner-facing LMS operations. Every call is scoped to the learner's own active learning enrollments.
/// </summary>
public interface ILearnerLearningService
{
    Task<IReadOnlyList<MyCourseDto>> GetMyCoursesAsync(Guid learnerId, CancellationToken cancellationToken = default);

    Task<CourseLearningDto> GetCourseAsync(Guid learnerId, Guid courseOfferingId, CancellationToken cancellationToken = default);

    Task<LearnerResourceDto> CompleteResourceAsync(Guid learnerId, Guid resourceId, CancellationToken cancellationToken = default);

    Task<SubmissionDto> SubmitAssignmentAsync(Guid learnerId, Guid assignmentId, SubmitAssignmentRequest request, CancellationToken cancellationToken = default);

    /// <summary>Submits text and/or files as a new attempt; at least one of the two is required.</summary>
    Task<SubmissionDto> SubmitAssignmentAsync(Guid learnerId, Guid assignmentId, string? body, IReadOnlyList<IncomingFile> files, CancellationToken cancellationToken = default);
}
