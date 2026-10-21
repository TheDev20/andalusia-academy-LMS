using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc;
using AndalusiaAcademy.API.DTOs.Learning;
using AndalusiaAcademy.API.DTOs.Operations;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.Tests.Infrastructure;

namespace AndalusiaAcademy.Tests.IntegrationTests.ApiContracts;

/// <summary>
/// Request validation runs in the MVC pipeline (record constructor-parameter attributes), so it is tested over HTTP.
/// </summary>
[Collection(ApiCollection.Name)]
public class ValidationTests
{
    private readonly TestScenario _scenario;

    public ValidationTests(SqlServerApiFactory factory)
    {
        _scenario = new TestScenario(factory);
    }

    [Fact]
    public async Task Invalid_registration_returns_field_level_problem_details()
    {
        var response = await _scenario.Anonymous().PostAsJsonAsync("/api/auth/register",
            new { firstName = "A", lastName = "B", email = "not-an-email", password = "short" });

        await response.EnsureStatusAsync(HttpStatusCode.BadRequest);
        var problem = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();
        Assert.Contains("Email", problem!.Errors.Keys);
        Assert.Contains("Password", problem.Errors.Keys);
    }

    [Theory]
    [InlineData("Refunded")]
    [InlineData("")]
    public async Task Unknown_payment_outcomes_are_rejected(string outcome)
    {
        var learner = await _scenario.RegisterLearnerAsync();
        var request = new HttpRequestMessage(HttpMethod.Post, $"/api/payments/orders/{Guid.NewGuid()}/simulate")
        {
            Content = JsonContent.Create(new { outcome })
        };
        request.Headers.Add("Idempotency-Key", Guid.NewGuid().ToString("N"));

        await (await learner.Client.SendAsync(request)).EnsureStatusAsync(HttpStatusCode.BadRequest);
    }

    [Theory]
    [InlineData("Intro To SQL")]
    [InlineData("trailing-")]
    public async Task Course_slugs_must_be_kebab_case(string slug)
    {
        var admin = await _scenario.CreateUserAsync(AppRoles.Admin);
        var response = await admin.Client.PostAsJsonAsync("/api/admin/courses",
            new UpsertCourseRequest("Title", slug, "Description", PublicationStatuses.Draft));

        await response.EnsureStatusAsync(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Unknown_attendance_status_is_rejected()
    {
        var admin = await _scenario.CreateUserAsync(AppRoles.Admin);
        var cohort = await _scenario.CreateCohortAsync(admin);

        var response = await admin.Client.PutAsJsonAsync($"/api/instructor/sessions/{cohort.PastSessionId}/attendance",
            new RecordAttendanceRequest([new AttendanceEntry(Guid.NewGuid(), "Sleeping", null)]));

        await response.EnsureStatusAsync(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Offering_end_must_follow_start()
    {
        var admin = await _scenario.CreateUserAsync(AppRoles.Admin);
        var cohort = await _scenario.CreateCohortAsync(admin);
        var now = DateTimeOffset.UtcNow;

        var response = await admin.Client.PostAsJsonAsync("/api/admin/offerings",
            new UpsertOfferingRequest(cohort.CourseId, now.AddDays(10), now.AddDays(9), "UTC", 10m, "EGP", 5, OfferingStatuses.Planned));

        await response.EnsureStatusAsync(HttpStatusCode.UnprocessableEntity);
    }
}
