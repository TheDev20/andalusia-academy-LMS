using AndalusiaAcademy.API.Models.Admissions;
using AndalusiaAcademy.API.Models.Catalog;
using AndalusiaAcademy.API.Models.Payments;

namespace AndalusiaAcademy.API.Repositories.Interfaces;

public interface IAdmissionsRepository
{
    Task<Offering?> GetOfferingWithDetailsAsync(Guid offeringId, CancellationToken ct = default);
    Task<bool> HasActiveApplicationAsync(Guid learnerId, Guid offeringId, CancellationToken ct = default);
    Task<(Application Application, SalesOrder SalesOrder)> CreateApplicationWithOrderAsync(Application application, SalesOrder salesOrder, CancellationToken ct = default);
    Task<List<Application>> GetLearnerApplicationsAsync(Guid learnerId, CancellationToken ct = default);
    Task<List<SalesOrder>> GetSalesOrdersByApplicationIdsAsync(IEnumerable<Guid> applicationIds, CancellationToken ct = default);
    Task<SalesOrder?> GetSalesOrderWithApplicationAsync(Guid salesOrderId, CancellationToken ct = default);
    Task<PaymentAttempt?> GetPaymentByIdempotencyKeyAsync(string idempotencyKey, CancellationToken ct = default);
    Task<List<PaymentAttempt>> GetLearnerPaymentsAsync(Guid learnerId, CancellationToken ct = default);
    Task<List<LearningEnrollment>> GetLearnerEnrollmentsAsync(Guid learnerId, CancellationToken ct = default);
    Task<List<Offering>> GetCourseOfferingsForProgramAsync(Guid programId, CancellationToken ct = default);
    Task<bool> HasActiveLearningEnrollmentAsync(Guid learnerId, Guid courseOfferingId, CancellationToken ct = default);
    Task SavePaymentAndEnrollmentAsync(
        PaymentAttempt attempt,
        SalesOrder order,
        Application application,
        Enrollment enrollment,
        List<LearningEnrollment> learningEnrollments,
        CancellationToken ct = default);
}
