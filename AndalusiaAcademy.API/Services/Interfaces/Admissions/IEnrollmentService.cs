using AndalusiaAcademy.API.DTOs.Admissions;
using AndalusiaAcademy.API.Models.Admissions;

namespace AndalusiaAcademy.API.Services.Interfaces.Admissions;

public interface IEnrollmentService
{
    /// <summary>
    /// Stages the Enrollment and per-course LearningEnrollments for an accepted application.
    /// Does not save; the caller commits it with the payment settlement.
    /// </summary>
    Task<Enrollment> StageFulfillmentAsync(Application application, DateTimeOffset now, CancellationToken cancellationToken);

    Task<IReadOnlyList<EnrollmentDto>> GetForLearnerAsync(Guid learnerId, CancellationToken cancellationToken = default);
}
