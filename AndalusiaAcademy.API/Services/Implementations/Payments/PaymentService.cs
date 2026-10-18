using AndalusiaAcademy.API.DTOs.Payments;
using AndalusiaAcademy.API.Exceptions;
using AndalusiaAcademy.API.Models.Admissions;
using AndalusiaAcademy.API.Models.Payments;
using AndalusiaAcademy.API.Repositories.Interfaces;
using AndalusiaAcademy.API.Services.Interfaces.Payments;

namespace AndalusiaAcademy.API.Services.Implementations.Payments;

public class PaymentService : IPaymentService
{
    private readonly IAdmissionsRepository _repository;

    public PaymentService(IAdmissionsRepository repository)
    {
        _repository = repository;
    }

    public async Task<PaymentAttemptDto> ProcessPaymentAttemptAsync(
        Guid learnerId,
        CreatePaymentAttemptRequest request,
        CancellationToken ct = default)
    {
        var existingAttempt = await _repository.GetPaymentByIdempotencyKeyAsync(request.IdempotencyKey.Trim(), ct);
        if (existingAttempt != null)
        {
            if (existingAttempt.SalesOrder.Application.LearnerId != learnerId)
            {
                throw new ForbiddenException("You do not have permission to access this payment record.");
            }
            return MapToDto(existingAttempt);
        }

        var salesOrder = await _repository.GetSalesOrderWithApplicationAsync(request.SalesOrderId, ct);
        if (salesOrder == null)
        {
            throw new NotFoundException("Sales order not found.");
        }

        var application = salesOrder.Application;
        if (application.LearnerId != learnerId)
        {
            throw new ForbiddenException("You cannot pay for an application that belongs to another user.");
        }

        if (salesOrder.Status == "Paid")
        {
            throw new ConflictException("This sales order has already been paid and settled.");
        }

        var now = DateTimeOffset.UtcNow;
        var providerPaymentId = $"SIM-{Guid.NewGuid().ToString("N")[..10].ToUpperInvariant()}";

        var attempt = new PaymentAttempt
        {
            SalesOrderId = salesOrder.Id,
            SalesOrder = salesOrder,
            Amount = salesOrder.AmountDue,
            Currency = salesOrder.Currency,
            Provider = string.IsNullOrWhiteSpace(request.Provider) ? "SimulatedCard" : request.Provider.Trim(),
            ProviderPaymentId = providerPaymentId,
            IdempotencyKey = request.IdempotencyKey.Trim(),
            Status = "Settled",
            CreatedAt = now,
            SettledAt = now
        };

        salesOrder.Status = "Paid";
        application.Status = "Approved";

        var enrollment = new Enrollment
        {
            ApplicationId = application.Id,
            LearnerId = learnerId,
            Status = "Active",
            EnrolledAt = now
        };

        var learningEnrollments = new List<LearningEnrollment>();
        var offering = application.Offering;

        if (offering.Kind == "Course")
        {
            if (!await _repository.HasActiveLearningEnrollmentAsync(learnerId, offering.Id, ct))
            {
                learningEnrollments.Add(new LearningEnrollment
                {
                    EnrollmentId = enrollment.Id,
                    LearnerId = learnerId,
                    CourseOfferingId = offering.Id,
                    CourseKind = "Course",
                    Status = "Active"
                });
            }
        }
        else if (offering.Kind == "Program" && offering.ProgramId.HasValue)
        {
            var courseOfferings = await _repository.GetCourseOfferingsForProgramAsync(offering.ProgramId.Value, ct);
            foreach (var co in courseOfferings)
            {
                if (!await _repository.HasActiveLearningEnrollmentAsync(learnerId, co.Id, ct))
                {
                    learningEnrollments.Add(new LearningEnrollment
                    {
                        EnrollmentId = enrollment.Id,
                        LearnerId = learnerId,
                        CourseOfferingId = co.Id,
                        CourseKind = "Course",
                        Status = "Active"
                    });
                }
            }
        }

        await _repository.SavePaymentAndEnrollmentAsync(attempt, salesOrder, application, enrollment, learningEnrollments, ct);

        return MapToDto(attempt);
    }

    public async Task<List<PaymentAttemptDto>> GetMyPaymentsAsync(Guid learnerId, CancellationToken ct = default)
    {
        var payments = await _repository.GetLearnerPaymentsAsync(learnerId, ct);
        return payments.Select(MapToDto).ToList();
    }

    private static PaymentAttemptDto MapToDto(PaymentAttempt attempt)
    {
        var offering = attempt.SalesOrder.Application.Offering;
        var title = offering.Kind == "Program"
            ? offering.Program?.Title ?? "Program Cohort"
            : offering.Course?.Title ?? "Course Cohort";

        return new PaymentAttemptDto
        {
            Id = attempt.Id,
            SalesOrderId = attempt.SalesOrderId,
            ApplicationId = attempt.SalesOrder.ApplicationId,
            Title = title,
            Amount = attempt.Amount,
            Currency = attempt.Currency.Trim(),
            Provider = attempt.Provider,
            ProviderPaymentId = attempt.ProviderPaymentId,
            Status = attempt.Status,
            CreatedAt = attempt.CreatedAt,
            SettledAt = attempt.SettledAt
        };
    }
}
