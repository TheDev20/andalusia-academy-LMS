using AndalusiaAcademy.API.DTOs.Admissions;
using AndalusiaAcademy.API.DTOs.Learning;
using AndalusiaAcademy.API.Exceptions;
using AndalusiaAcademy.API.Models.Admissions;
using AndalusiaAcademy.API.Models.Payments;
using AndalusiaAcademy.API.Repositories.Interfaces;
using AndalusiaAcademy.API.Services.Interfaces.Admissions;

namespace AndalusiaAcademy.API.Services.Implementations.Admissions;

public class AdmissionsService : IAdmissionsService
{
    private readonly IAdmissionsRepository _repository;

    public AdmissionsService(IAdmissionsRepository repository)
    {
        _repository = repository;
    }

    public async Task<ApplicationDto> SubmitApplicationAsync(
        Guid learnerId,
        CreateApplicationRequest request,
        CancellationToken ct = default)
    {
        var offering = await _repository.GetOfferingWithDetailsAsync(request.OfferingId, ct);
        if (offering == null || offering.Status != "Published")
        {
            throw new NotFoundException("The requested cohort offering was not found or is not open for admission.");
        }

        if (await _repository.HasActiveApplicationAsync(learnerId, request.OfferingId, ct))
        {
            throw new ConflictException("You have already submitted an application for this offering.");
        }

        var now = DateTimeOffset.UtcNow;
        var application = new Application
        {
            LearnerId = learnerId,
            OfferingId = offering.Id,
            Status = "Submitted",
            SubmittedAt = now,
            CreatedAt = now
        };

        var salesOrder = new SalesOrder
        {
            ApplicationId = application.Id,
            AmountDue = offering.Price,
            Currency = offering.Currency,
            Status = "PendingPayment",
            CreatedAt = now
        };

        await _repository.CreateApplicationWithOrderAsync(application, salesOrder, ct);

        var title = offering.Kind == "Program"
            ? offering.Program?.Title ?? "Program Cohort"
            : offering.Course?.Title ?? "Course Cohort";

        var slug = offering.Kind == "Program"
            ? offering.Program?.Slug ?? ""
            : offering.Course?.Slug ?? "";

        var itemId = offering.Kind == "Program"
            ? offering.ProgramId ?? offering.Id
            : offering.CourseId ?? offering.Id;

        return new ApplicationDto
        {
            Id = application.Id,
            OfferingId = offering.Id,
            OfferingKind = offering.Kind,
            ItemId = itemId,
            Title = title,
            Slug = slug,
            Status = application.Status,
            SubmittedAt = application.SubmittedAt ?? now,
            SalesOrderId = salesOrder.Id,
            AmountDue = salesOrder.AmountDue,
            Currency = salesOrder.Currency.Trim(),
            OrderStatus = salesOrder.Status
        };
    }

    public async Task<List<ApplicationDto>> GetMyApplicationsAsync(Guid learnerId, CancellationToken ct = default)
    {
        var applications = await _repository.GetLearnerApplicationsAsync(learnerId, ct);
        var orders = await _repository.GetSalesOrdersByApplicationIdsAsync(applications.Select(a => a.Id), ct);
        var orderMap = orders.ToDictionary(o => o.ApplicationId);

        return applications.Select(app =>
        {
            orderMap.TryGetValue(app.Id, out var order);
            var offering = app.Offering;
            var title = offering.Kind == "Program"
                ? offering.Program?.Title ?? "Program Cohort"
                : offering.Course?.Title ?? "Course Cohort";

            var slug = offering.Kind == "Program"
                ? offering.Program?.Slug ?? ""
                : offering.Course?.Slug ?? "";

            var itemId = offering.Kind == "Program"
                ? offering.ProgramId ?? offering.Id
                : offering.CourseId ?? offering.Id;

            return new ApplicationDto
            {
                Id = app.Id,
                OfferingId = offering.Id,
                OfferingKind = offering.Kind,
                ItemId = itemId,
                Title = title,
                Slug = slug,
                Status = app.Status,
                SubmittedAt = app.SubmittedAt ?? app.CreatedAt,
                SalesOrderId = order?.Id,
                AmountDue = order?.AmountDue ?? offering.Price,
                Currency = (order?.Currency ?? offering.Currency).Trim(),
                OrderStatus = order?.Status ?? "PendingPayment"
            };
        }).ToList();
    }

    public async Task<List<EnrolledCourseDto>> GetMyLearningAsync(Guid learnerId, CancellationToken ct = default)
    {
        var enrollments = await _repository.GetLearnerEnrollmentsAsync(learnerId, ct);

        return enrollments.Select(le =>
        {
            var course = le.CourseOffering.Course;
            var primaryCategory = course?.CourseCategories
                .OrderBy(cc => cc.Sequence)
                .Select(cc => cc.Category.Name)
                .FirstOrDefault() ?? "Software Engineering";

            return new EnrolledCourseDto
            {
                LearningEnrollmentId = le.Id,
                EnrollmentId = le.EnrollmentId,
                CourseId = course?.Id ?? le.CourseOfferingId,
                Title = course?.Title ?? "Enrolled Course",
                Slug = course?.Slug ?? "",
                ImageUrl = course?.ImageUrl,
                Category = primaryCategory,
                Status = le.Status,
                StartsAt = le.CourseOffering.StartsAt,
                EndsAt = le.CourseOffering.EndsAt,
                EnrolledAt = le.Enrollment.EnrolledAt
            };
        }).ToList();
    }
}
