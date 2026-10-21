using AndalusiaAcademy.API.DTOs.Common;
using AndalusiaAcademy.API.DTOs.Operations;

namespace AndalusiaAcademy.API.Services.Interfaces.Operations;

public interface IAdminUserService
{
    Task<PagedResult<AdminUserDto>> ListAsync(AdminUserQuery query, CancellationToken cancellationToken = default);
    Task<AdminUserDto> GetAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<AdminUserDto> CreateInstructorAsync(CreateInstructorRequest request, CancellationToken cancellationToken = default);
    Task<AdminUserDto> SetStatusAsync(Guid userId, SetUserStatusRequest request, CancellationToken cancellationToken = default);
    Task<AdminUserDto> SetRolesAsync(Guid userId, SetUserRolesRequest request, CancellationToken cancellationToken = default);
}

public interface IAdminCourseService
{
    Task<PagedResult<AdminCourseDto>> ListAsync(AdminListQuery query, CancellationToken cancellationToken = default);
    Task<AdminCourseDto> GetAsync(Guid courseId, CancellationToken cancellationToken = default);
    Task<AdminCourseDto> CreateAsync(UpsertCourseRequest request, CancellationToken cancellationToken = default);
    Task<AdminCourseDto> UpdateAsync(Guid courseId, UpsertCourseRequest request, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid courseId, CancellationToken cancellationToken = default);
}

public interface IAdminOfferingService
{
    Task<IReadOnlyList<AdminOfferingDto>> ListAsync(Guid? courseId, CancellationToken cancellationToken = default);
    Task<AdminOfferingDto> GetAsync(Guid offeringId, CancellationToken cancellationToken = default);
    Task<AdminOfferingDto> CreateAsync(UpsertOfferingRequest request, CancellationToken cancellationToken = default);
    Task<AdminOfferingDto> UpdateAsync(Guid offeringId, UpsertOfferingRequest request, CancellationToken cancellationToken = default);
    Task<AdminOfferingDto> AssignInstructorAsync(Guid offeringId, AssignInstructorRequest request, CancellationToken cancellationToken = default);
    Task<AdminOfferingDto> UnassignInstructorAsync(Guid offeringId, Guid instructorId, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<AdminResourceDto>> ListResourcesAsync(Guid offeringId, CancellationToken cancellationToken = default);
    Task<AdminResourceDto> CreateResourceAsync(Guid offeringId, UpsertResourceRequest request, CancellationToken cancellationToken = default);
    Task<AdminResourceDto> UpdateResourceAsync(Guid resourceId, UpsertResourceRequest request, CancellationToken cancellationToken = default);
    Task DeleteResourceAsync(Guid resourceId, CancellationToken cancellationToken = default);
}

public interface IAdminScheduleService
{
    Task<IReadOnlyList<AdminLocationDto>> ListLocationsAsync(CancellationToken cancellationToken = default);
    Task<AdminLocationDto> CreateLocationAsync(UpsertLocationRequest request, CancellationToken cancellationToken = default);
    Task<AdminLocationDto> UpdateLocationAsync(Guid locationId, UpsertLocationRequest request, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<AdminSessionDto>> ListSessionsAsync(Guid offeringId, CancellationToken cancellationToken = default);
    Task<AdminSessionDto> CreateSessionAsync(Guid offeringId, UpsertSessionRequest request, CancellationToken cancellationToken = default);
    Task<AdminSessionDto> UpdateSessionAsync(Guid sessionId, UpsertSessionRequest request, CancellationToken cancellationToken = default);
    Task DeleteSessionAsync(Guid sessionId, CancellationToken cancellationToken = default);
}

public interface IAdminPaymentService
{
    Task<PagedResult<AdminOrderDto>> ListOrdersAsync(AdminOrderQuery query, CancellationToken cancellationToken = default);
}
