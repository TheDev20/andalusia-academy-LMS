using System.Net;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using AndalusiaAcademy.API.DTOs.Admissions;
using AndalusiaAcademy.API.DTOs.Catalog;
using AndalusiaAcademy.API.DTOs.Learning;
using AndalusiaAcademy.API.DTOs.Payments;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.Tests.Infrastructure;

namespace AndalusiaAcademy.Tests.IntegrationTests.EndToEndSlices;

/// <summary>
/// Sprint 3 Definition of Done: register → login → apply → pay → enrollment → learner dashboard.
/// </summary>
[Collection(ApiCollection.Name)]
public class LearnerConversionJourneyTests
{
    private readonly SqlServerApiFactory _factory;
    private readonly TestScenario _scenario;

    public LearnerConversionJourneyTests(SqlServerApiFactory factory)
    {
        _factory = factory;
        _scenario = new TestScenario(factory);
    }

    [Fact]
    public async Task Visitor_becomes_an_enrolled_learner()
    {
        var admin = await _scenario.CreateUserAsync(AppRoles.Admin);
        var cohort = await _scenario.CreateCohortAsync(admin, capacity: 5, price: 2500m);
        var learner = await _scenario.RegisterLearnerAsync();

        // Browse to the course: its open offerings are public.
        var visitor = _scenario.Anonymous();
        var offerings = await visitor.GetFromJsonAsync<List<OpenOfferingDto>>($"/api/catalog/courses/{cohort.CourseSlug}/offerings");
        var open = Assert.Single(offerings!);
        Assert.Equal(cohort.OfferingId, open.Id);
        Assert.Equal(5, open.SeatsRemaining);

        // Apply from course details.
        var applyResponse = await learner.Client.PostAsJsonAsync("/api/applications", new CreateApplicationRequest(open.Id));
        await applyResponse.EnsureStatusAsync(HttpStatusCode.Created);
        var application = (await applyResponse.Content.ReadFromJsonAsync<ApplicationDto>())!;
        Assert.Equal(ApplicationStatuses.Submitted, application.Status);
        Assert.NotNull(application.SeatHeldUntil);
        Assert.Equal(4, Assert.Single((await visitor.GetFromJsonAsync<List<OpenOfferingDto>>(
            $"/api/catalog/courses/{cohort.CourseSlug}/offerings"))!).SeatsRemaining);

        // Checkout is idempotent per application.
        var order = (await (await learner.Client.PostAsJsonAsync("/api/payments/orders", new CreateOrderRequest(application.Id)))
            .Content.ReadFromJsonAsync<OrderDto>())!;
        var sameOrder = (await (await learner.Client.PostAsJsonAsync("/api/payments/orders", new CreateOrderRequest(application.Id)))
            .Content.ReadFromJsonAsync<OrderDto>())!;
        Assert.Equal(order.Id, sameOrder.Id);
        Assert.Equal(2500m, order.AmountDue);
        Assert.Equal(OrderStatuses.PendingPayment, order.Status);

        // Pay.
        var payResponse = await TestScenario.PayAsync(learner, order.Id, PaymentAttemptStatuses.Succeeded, "journey-" + Guid.NewGuid().ToString("N"));
        await payResponse.EnsureStatusAsync(HttpStatusCode.OK);
        var payment = (await payResponse.Content.ReadFromJsonAsync<PaymentResultDto>())!;
        Assert.Equal(OrderStatuses.Paid, payment.OrderStatus);
        Assert.Equal(PaymentAttemptStatuses.Succeeded, payment.Attempt.Status);
        Assert.NotNull(payment.EnrollmentId);

        // My Applications / My Payments / Enrollments.
        var myApplications = await learner.Client.GetFromJsonAsync<List<ApplicationDto>>("/api/applications/mine");
        var accepted = Assert.Single(myApplications!);
        Assert.Equal(ApplicationStatuses.Accepted, accepted.Status);
        Assert.Equal(payment.EnrollmentId, accepted.EnrollmentId);
        Assert.Null(accepted.SeatHeldUntil);

        var myPayments = await learner.Client.GetFromJsonAsync<List<OrderDto>>("/api/payments/mine");
        var paidOrder = Assert.Single(myPayments!);
        Assert.Equal(OrderStatuses.Paid, paidOrder.Status);
        Assert.Single(paidOrder.Attempts);

        var enrollments = await learner.Client.GetFromJsonAsync<List<EnrollmentDto>>("/api/enrollments/mine");
        var enrollment = Assert.Single(enrollments!);
        Assert.Equal(EnrollmentStatuses.Active, enrollment.Status);
        Assert.Equal(cohort.OfferingId, Assert.Single(enrollment.Courses).CourseOfferingId);

        // Learner dashboard shows the enrolled course and its learning page.
        var myCourses = await learner.Client.GetFromJsonAsync<List<MyCourseDto>>("/api/learning/courses");
        Assert.Equal(cohort.OfferingId, Assert.Single(myCourses!).CourseOfferingId);

        var page = await learner.Client.GetFromJsonAsync<CourseLearningDto>($"/api/learning/courses/{cohort.OfferingId}");
        Assert.Single(page!.Sessions);
        Assert.Equal("Main Campus", page.Sessions[0].Location?.Name);
        Assert.Single(page.Resources);
        Assert.Single(page.Assignments);

        // Seat is converted, not double counted.
        var reservationStatus = await _factory.WithDbAsync(db =>
            db.SeatReservations.Where(r => r.ApplicationId == application.Id).Select(r => r.Status).SingleAsync());
        Assert.Equal(ReservationStatuses.Converted, reservationStatus);
    }

    [Fact]
    public async Task Replaying_an_idempotency_key_does_not_charge_twice()
    {
        var admin = await _scenario.CreateUserAsync(AppRoles.Admin);
        var cohort = await _scenario.CreateCohortAsync(admin);
        var learner = await _scenario.RegisterLearnerAsync();
        var orderId = await CheckoutAsync(learner, cohort.OfferingId);
        var key = "replay-" + Guid.NewGuid().ToString("N");

        var first = await (await TestScenario.PayAsync(learner, orderId, "Succeeded", key)).Content.ReadFromJsonAsync<PaymentResultDto>();
        var replay = await TestScenario.PayAsync(learner, orderId, "Succeeded", key);
        await replay.EnsureStatusAsync(HttpStatusCode.OK);
        var second = await replay.Content.ReadFromJsonAsync<PaymentResultDto>();

        Assert.Equal(first!.Attempt.Id, second!.Attempt.Id);
        Assert.Equal(first.EnrollmentId, second.EnrollmentId);
        Assert.Equal(1, await _factory.WithDbAsync(db => db.PaymentAttempts.CountAsync(pa => pa.SalesOrderId == orderId)));

        // A new key on a paid order is rejected.
        var again = await TestScenario.PayAsync(learner, orderId, "Succeeded", "replay-" + Guid.NewGuid().ToString("N"));
        await again.EnsureStatusAsync(HttpStatusCode.Conflict);
    }

    [Fact]
    public async Task Failed_payment_keeps_order_pending_and_can_be_retried()
    {
        var admin = await _scenario.CreateUserAsync(AppRoles.Admin);
        var cohort = await _scenario.CreateCohortAsync(admin);
        var learner = await _scenario.RegisterLearnerAsync();
        var orderId = await CheckoutAsync(learner, cohort.OfferingId);

        var failed = await (await TestScenario.PayAsync(learner, orderId, "Failed", Guid.NewGuid().ToString("N")))
            .Content.ReadFromJsonAsync<PaymentResultDto>();
        Assert.Equal(PaymentAttemptStatuses.Failed, failed!.Attempt.Status);
        Assert.Equal(OrderStatuses.PendingPayment, failed.OrderStatus);
        Assert.Null(failed.EnrollmentId);
        Assert.Empty((await learner.Client.GetFromJsonAsync<List<EnrollmentDto>>("/api/enrollments/mine"))!);

        var retried = await (await TestScenario.PayAsync(learner, orderId, "Succeeded", Guid.NewGuid().ToString("N")))
            .Content.ReadFromJsonAsync<PaymentResultDto>();
        Assert.Equal(OrderStatuses.Paid, retried!.OrderStatus);
        Assert.NotNull(retried.EnrollmentId);
    }

    [Fact]
    public async Task Idempotency_key_is_required()
    {
        var admin = await _scenario.CreateUserAsync(AppRoles.Admin);
        var cohort = await _scenario.CreateCohortAsync(admin);
        var learner = await _scenario.RegisterLearnerAsync();
        var orderId = await CheckoutAsync(learner, cohort.OfferingId);

        var response = await learner.Client.PostAsJsonAsync($"/api/payments/orders/{orderId}/simulate", new SimulatePaymentRequest("Succeeded"));

        await response.EnsureStatusAsync(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Duplicate_live_application_is_rejected()
    {
        var admin = await _scenario.CreateUserAsync(AppRoles.Admin);
        var cohort = await _scenario.CreateCohortAsync(admin);
        var learner = await _scenario.RegisterLearnerAsync();

        await (await learner.Client.PostAsJsonAsync("/api/applications", new CreateApplicationRequest(cohort.OfferingId)))
            .EnsureStatusAsync(HttpStatusCode.Created);
        var duplicate = await learner.Client.PostAsJsonAsync("/api/applications", new CreateApplicationRequest(cohort.OfferingId));

        await duplicate.EnsureStatusAsync(HttpStatusCode.Conflict);
    }

    [Fact]
    public async Task Cancelled_application_releases_its_seat()
    {
        var admin = await _scenario.CreateUserAsync(AppRoles.Admin);
        var cohort = await _scenario.CreateCohortAsync(admin, capacity: 1);
        var first = await _scenario.RegisterLearnerAsync();
        var second = await _scenario.RegisterLearnerAsync();

        var application = (await (await first.Client.PostAsJsonAsync("/api/applications", new CreateApplicationRequest(cohort.OfferingId)))
            .Content.ReadFromJsonAsync<ApplicationDto>())!;
        await (await second.Client.PostAsJsonAsync("/api/applications", new CreateApplicationRequest(cohort.OfferingId)))
            .EnsureStatusAsync(HttpStatusCode.Conflict);

        var cancel = await first.Client.PostAsync($"/api/applications/{application.Id}/cancel", null);
        await cancel.EnsureStatusAsync(HttpStatusCode.OK);
        Assert.Equal(ApplicationStatuses.Cancelled, (await cancel.Content.ReadFromJsonAsync<ApplicationDto>())!.Status);

        await (await second.Client.PostAsJsonAsync("/api/applications", new CreateApplicationRequest(cohort.OfferingId)))
            .EnsureStatusAsync(HttpStatusCode.Created);
    }

    [Fact]
    public async Task Concurrent_applications_never_oversell_capacity()
    {
        var admin = await _scenario.CreateUserAsync(AppRoles.Admin);
        var cohort = await _scenario.CreateCohortAsync(admin, capacity: 2);
        var learners = await Task.WhenAll(Enumerable.Range(0, 8).Select(_ => _scenario.RegisterLearnerAsync()));

        var responses = await Task.WhenAll(learners.Select(l =>
            l.Client.PostAsJsonAsync("/api/applications", new CreateApplicationRequest(cohort.OfferingId))));

        Assert.Equal(2, responses.Count(r => r.StatusCode == HttpStatusCode.Created));
        Assert.All(responses.Where(r => r.StatusCode != HttpStatusCode.Created),
            r => Assert.Equal(HttpStatusCode.Conflict, r.StatusCode));
    }

    [Fact]
    public async Task Expired_seat_hold_blocks_payment_and_allows_reapplying()
    {
        var admin = await _scenario.CreateUserAsync(AppRoles.Admin);
        var cohort = await _scenario.CreateCohortAsync(admin);
        var learner = await _scenario.RegisterLearnerAsync();
        var orderId = await CheckoutAsync(learner, cohort.OfferingId);

        await _factory.WithDbAsync(db => db.SeatReservations
            .Where(r => r.Application.LearnerId == learner.Id)
            .ExecuteUpdateAsync(s => s.SetProperty(r => r.ExpiresAt, DateTimeOffset.UtcNow.AddMinutes(-1))));

        var pay = await TestScenario.PayAsync(learner, orderId, "Succeeded", Guid.NewGuid().ToString("N"));
        await pay.EnsureStatusAsync(HttpStatusCode.Conflict);

        var applications = await learner.Client.GetFromJsonAsync<List<ApplicationDto>>("/api/applications/mine");
        Assert.Equal(ApplicationStatuses.Expired, Assert.Single(applications!).Status);
        Assert.Equal(OrderStatuses.Cancelled, Assert.Single(applications!).OrderStatus);

        await (await learner.Client.PostAsJsonAsync("/api/applications", new CreateApplicationRequest(cohort.OfferingId)))
            .EnsureStatusAsync(HttpStatusCode.Created);
    }

    [Fact]
    public async Task Offerings_of_unknown_or_draft_courses_are_not_listed()
    {
        var visitor = _scenario.Anonymous();
        await (await visitor.GetAsync($"/api/catalog/courses/no-such-course-{Guid.NewGuid():N}/offerings")).EnsureStatusAsync(HttpStatusCode.NotFound);

        var admin = await _scenario.CreateUserAsync(AppRoles.Admin);
        var cohort = await _scenario.CreateCohortAsync(admin);
        await _factory.WithDbAsync(db => db.Courses.Where(c => c.Id == cohort.CourseId)
            .ExecuteUpdateAsync(s => s.SetProperty(c => c.PublicationStatus, PublicationStatuses.Draft)));

        await (await visitor.GetAsync($"/api/catalog/courses/{cohort.CourseSlug}/offerings")).EnsureStatusAsync(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Unpublished_or_unknown_offerings_cannot_be_applied_for()
    {
        var learner = await _scenario.RegisterLearnerAsync();

        var unknown = await learner.Client.PostAsJsonAsync("/api/applications", new CreateApplicationRequest(Guid.NewGuid()));
        await unknown.EnsureStatusAsync(HttpStatusCode.NotFound);

        var admin = await _scenario.CreateUserAsync(AppRoles.Admin);
        var cohort = await _scenario.CreateCohortAsync(admin);
        await _factory.WithDbAsync(db => db.Offerings.Where(o => o.Id == cohort.OfferingId)
            .ExecuteUpdateAsync(s => s.SetProperty(o => o.Status, OfferingStatuses.Planned)));

        var planned = await learner.Client.PostAsJsonAsync("/api/applications", new CreateApplicationRequest(cohort.OfferingId));
        await planned.EnsureStatusAsync(HttpStatusCode.UnprocessableEntity);
    }

    private static async Task<Guid> CheckoutAsync(TestUser learner, Guid offeringId)
    {
        var application = (await (await learner.Client.PostAsJsonAsync("/api/applications", new CreateApplicationRequest(offeringId)))
            .Content.ReadFromJsonAsync<ApplicationDto>())!;
        var order = (await (await learner.Client.PostAsJsonAsync("/api/payments/orders", new CreateOrderRequest(application.Id)))
            .Content.ReadFromJsonAsync<OrderDto>())!;
        return order.Id;
    }
}
