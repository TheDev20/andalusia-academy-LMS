using AndalusiaAcademy.API.DTOs.Learning;

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
}
