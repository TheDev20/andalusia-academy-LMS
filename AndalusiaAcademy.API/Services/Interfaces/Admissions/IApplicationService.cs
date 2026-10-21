using AndalusiaAcademy.API.DTOs.Admissions;

namespace AndalusiaAcademy.API.Services.Interfaces.Admissions;

public interface IApplicationService
{
    /// <summary>Submits an application and holds a seat on the offering (ADR 004).</summary>
    Task<ApplicationDto> SubmitAsync(Guid learnerId, CreateApplicationRequest request, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<ApplicationDto>> GetForLearnerAsync(Guid learnerId, CancellationToken cancellationToken = default);

    Task<ApplicationDto> GetForLearnerAsync(Guid learnerId, Guid applicationId, CancellationToken cancellationToken = default);

    Task<ApplicationDto> CancelAsync(Guid learnerId, Guid applicationId, CancellationToken cancellationToken = default);
}
