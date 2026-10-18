using AndalusiaAcademy.API.DTOs.Admissions;
using AndalusiaAcademy.API.DTOs.Learning;

namespace AndalusiaAcademy.API.Services.Interfaces.Admissions;

public interface IAdmissionsService
{
    Task<ApplicationDto> SubmitApplicationAsync(Guid learnerId, CreateApplicationRequest request, CancellationToken ct = default);
    Task<List<ApplicationDto>> GetMyApplicationsAsync(Guid learnerId, CancellationToken ct = default);
    Task<List<EnrolledCourseDto>> GetMyLearningAsync(Guid learnerId, CancellationToken ct = default);
}
