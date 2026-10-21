using System.Net;
using System.Net.Http.Json;
using AndalusiaAcademy.API.DTOs.Admissions;
using AndalusiaAcademy.API.DTOs.Identity;
using AndalusiaAcademy.API.DTOs.Learning;
using AndalusiaAcademy.API.DTOs.Operations;
using AndalusiaAcademy.API.DTOs.Payments;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.Tests.Infrastructure;

namespace AndalusiaAcademy.Tests.IntegrationTests.ApiContracts;

/// <summary>
/// Sprint 3 DoD #8 / Sprint 4 DoD #7: protected routes reject anonymous callers and unauthorized roles,
/// and resource-level checks stop users reaching other people's data.
/// </summary>
[Collection(ApiCollection.Name)]
public class AuthorizationTests
{
    private readonly SqlServerApiFactory _factory;
    private readonly TestScenario _scenario;

    public AuthorizationTests(SqlServerApiFactory factory)
    {
        _factory = factory;
        _scenario = new TestScenario(factory);
    }

    [Theory]
    [InlineData("GET", "/api/me/profile")]
    [InlineData("GET", "/api/applications/mine")]
    [InlineData("GET", "/api/payments/mine")]
    [InlineData("GET", "/api/enrollments/mine")]
    [InlineData("GET", "/api/learning/courses")]
    [InlineData("GET", "/api/instructor/cohorts")]
    [InlineData("GET", "/api/admin/users")]
    [InlineData("GET", "/api/admin/payments/orders")]
    [InlineData("POST", "/api/auth/logout")]
    public async Task Anonymous_callers_get_401(string method, string url)
    {
        var response = await _scenario.Anonymous().SendAsync(new HttpRequestMessage(new HttpMethod(method), url));
        await response.EnsureStatusAsync(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Tampered_or_foreign_tokens_are_rejected()
    {
        var client = _scenario.Anonymous();
        client.DefaultRequestHeaders.Authorization = new("Bearer",
            "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAiLCJwZXJtIjoidXNlcnMubWFuYWdlIn0.c2lnbmF0dXJl");

        await (await client.GetAsync("/api/admin/users")).EnsureStatusAsync(HttpStatusCode.Unauthorized);
    }

    [Theory]
    [InlineData("GET", "/api/admin/users")]
    [InlineData("GET", "/api/admin/courses")]
    [InlineData("GET", "/api/admin/payments/orders")]
    [InlineData("GET", "/api/admin/locations")]
    [InlineData("GET", "/api/instructor/cohorts")]
    public async Task Learners_cannot_reach_staff_endpoints(string method, string url)
    {
        var learner = await _scenario.RegisterLearnerAsync();
        var response = await learner.Client.SendAsync(new HttpRequestMessage(new HttpMethod(method), url));
        await response.EnsureStatusAsync(HttpStatusCode.Forbidden);
    }

    [Theory]
    [InlineData("GET", "/api/admin/users")]
    [InlineData("GET", "/api/admin/courses")]
    [InlineData("GET", "/api/admin/payments/orders")]
    [InlineData("GET", "/api/applications/mine")]
    [InlineData("GET", "/api/learning/courses")]
    public async Task Instructors_cannot_reach_admin_or_learner_endpoints(string method, string url)
    {
        var instructor = await _scenario.CreateUserAsync(AppRoles.Instructor);
        var response = await instructor.Client.SendAsync(new HttpRequestMessage(new HttpMethod(method), url));
        await response.EnsureStatusAsync(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task Content_manager_can_manage_courses_but_not_users_or_payments()
    {
        var contentManager = await _scenario.CreateUserAsync(AppRoles.ContentManager);

        await (await contentManager.Client.GetAsync("/api/admin/courses")).EnsureStatusAsync(HttpStatusCode.OK);
        await (await contentManager.Client.GetAsync("/api/admin/users")).EnsureStatusAsync(HttpStatusCode.Forbidden);
        await (await contentManager.Client.GetAsync("/api/admin/payments/orders")).EnsureStatusAsync(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task Instructor_cannot_manage_a_cohort_they_are_not_assigned_to()
    {
        var admin = await _scenario.CreateUserAsync(AppRoles.Admin);
        var assigned = await _scenario.CreateUserAsync(AppRoles.Instructor);
        var outsider = await _scenario.CreateUserAsync(AppRoles.Instructor);
        var cohort = await _scenario.CreateCohortAsync(admin, assigned.Id);

        await (await assigned.Client.GetAsync($"/api/instructor/cohorts/{cohort.OfferingId}")).EnsureStatusAsync(HttpStatusCode.OK);

        await (await outsider.Client.GetAsync($"/api/instructor/cohorts/{cohort.OfferingId}")).EnsureStatusAsync(HttpStatusCode.Forbidden);
        await (await outsider.Client.GetAsync($"/api/instructor/sessions/{cohort.PastSessionId}/attendance")).EnsureStatusAsync(HttpStatusCode.Forbidden);
        await (await outsider.Client.GetAsync($"/api/instructor/assignments/{cohort.AssignmentId}/submissions")).EnsureStatusAsync(HttpStatusCode.Forbidden);
        var record = await outsider.Client.PutAsJsonAsync($"/api/instructor/sessions/{cohort.PastSessionId}/attendance",
            new RecordAttendanceRequest([new AttendanceEntry(Guid.NewGuid(), AttendanceStatuses.Present, null)]));
        await record.EnsureStatusAsync(HttpStatusCode.Forbidden);

        var cohorts = await outsider.Client.GetFromJsonAsync<List<CohortDto>>("/api/instructor/cohorts");
        Assert.DoesNotContain(cohorts!, c => c.OfferingId == cohort.OfferingId);
    }

    [Fact]
    public async Task Learners_cannot_access_courses_they_are_not_enrolled_in()
    {
        var admin = await _scenario.CreateUserAsync(AppRoles.Admin);
        var cohort = await _scenario.CreateCohortAsync(admin);
        var learner = await _scenario.RegisterLearnerAsync();

        await (await learner.Client.GetAsync($"/api/learning/courses/{cohort.OfferingId}")).EnsureStatusAsync(HttpStatusCode.Forbidden);
        await (await learner.Client.PostAsync($"/api/learning/resources/{cohort.ResourceId}/complete", null)).EnsureStatusAsync(HttpStatusCode.Forbidden);
        var submit = await learner.Client.PostAsJsonAsync($"/api/learning/assignments/{cohort.AssignmentId}/submissions",
            new SubmitAssignmentRequest("Sneaky"));
        await submit.EnsureStatusAsync(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task Learners_cannot_see_or_pay_for_other_learners_applications()
    {
        var admin = await _scenario.CreateUserAsync(AppRoles.Admin);
        var cohort = await _scenario.CreateCohortAsync(admin);
        var owner = await _scenario.RegisterLearnerAsync();
        var other = await _scenario.RegisterLearnerAsync();

        var application = (await (await owner.Client.PostAsJsonAsync("/api/applications", new CreateApplicationRequest(cohort.OfferingId)))
            .Content.ReadFromJsonAsync<ApplicationDto>())!;
        var order = (await (await owner.Client.PostAsJsonAsync("/api/payments/orders", new CreateOrderRequest(application.Id)))
            .Content.ReadFromJsonAsync<OrderDto>())!;

        await (await other.Client.GetAsync($"/api/applications/{application.Id}")).EnsureStatusAsync(HttpStatusCode.NotFound);
        await (await other.Client.PostAsync($"/api/applications/{application.Id}/cancel", null)).EnsureStatusAsync(HttpStatusCode.NotFound);
        await (await other.Client.PostAsJsonAsync("/api/payments/orders", new CreateOrderRequest(application.Id))).EnsureStatusAsync(HttpStatusCode.NotFound);
        await (await TestScenario.PayAsync(other, order.Id, "Succeeded", Guid.NewGuid().ToString("N"))).EnsureStatusAsync(HttpStatusCode.NotFound);
        Assert.Empty((await other.Client.GetFromJsonAsync<List<OrderDto>>("/api/payments/mine"))!);
    }

    [Fact]
    public async Task Deactivated_users_lose_access_immediately_and_cannot_log_in()
    {
        var admin = await _scenario.CreateUserAsync(AppRoles.Admin);
        var learner = await _scenario.RegisterLearnerAsync();

        var deactivate = await admin.Client.PutAsJsonAsync($"/api/admin/users/{learner.Id}/status", new SetUserStatusRequest(false));
        await deactivate.EnsureStatusAsync(HttpStatusCode.OK);

        await (await learner.Client.GetAsync("/api/me/profile")).EnsureStatusAsync(HttpStatusCode.Unauthorized);
        await (await _scenario.Anonymous().PostAsJsonAsync("/api/auth/login", new LoginRequest(learner.Email, learner.Password)))
            .EnsureStatusAsync(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task Payment_simulation_can_be_disabled_per_environment()
    {
        await using var factory = new SqlServerApiFactory();
        factory.Overrides["Payments:SimulationEnabled"] = "false";
        await factory.InitializeAsync();
        try
        {
            var scenario = new TestScenario(factory);
            var admin = await scenario.CreateUserAsync(AppRoles.Admin);
            var cohort = await scenario.CreateCohortAsync(admin);
            var learner = await scenario.RegisterLearnerAsync();
            var application = (await (await learner.Client.PostAsJsonAsync("/api/applications", new CreateApplicationRequest(cohort.OfferingId)))
                .Content.ReadFromJsonAsync<ApplicationDto>())!;
            var order = (await (await learner.Client.PostAsJsonAsync("/api/payments/orders", new CreateOrderRequest(application.Id)))
                .Content.ReadFromJsonAsync<OrderDto>())!;

            var pay = await TestScenario.PayAsync(learner, order.Id, "Succeeded", Guid.NewGuid().ToString("N"));
            await pay.EnsureStatusAsync(HttpStatusCode.ServiceUnavailable);
        }
        finally
        {
            await ((IAsyncLifetime)factory).DisposeAsync();
        }
    }
}
