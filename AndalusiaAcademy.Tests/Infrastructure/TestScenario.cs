using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using AndalusiaAcademy.API.Data.Seed;
using AndalusiaAcademy.API.DTOs.Admissions;
using AndalusiaAcademy.API.DTOs.Identity;
using AndalusiaAcademy.API.DTOs.Operations;
using AndalusiaAcademy.API.DTOs.Payments;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.API.Models.Identity;

namespace AndalusiaAcademy.Tests.Infrastructure;

public sealed record TestUser(Guid Id, string Email, string Password, HttpClient Client);

public sealed record TestCohort(Guid CourseId, string CourseSlug, Guid OfferingId, Guid PastSessionId, Guid ResourceId, Guid AssignmentId);

/// <summary>
/// Builders for users and catalog data. Catalog data is created through the admin API so tests exercise it end to end.
/// </summary>
public sealed class TestScenario
{
    public const string Password = "Str0ng!Passw0rd";

    private readonly SqlServerApiFactory _factory;

    public TestScenario(SqlServerApiFactory factory)
    {
        _factory = factory;
    }

    public HttpClient Anonymous() => _factory.CreateClient();

    public async Task<TestUser> RegisterLearnerAsync()
    {
        var email = UniqueEmail("learner");
        var client = _factory.CreateClient();
        var response = await client.PostAsJsonAsync("/api/auth/register",
            new RegisterRequest("Test", "Learner", email, Password, null, null, null));
        await response.EnsureStatusAsync(HttpStatusCode.Created);

        var auth = (await response.Content.ReadFromJsonAsync<AuthResponse>())!;
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", auth.AccessToken);
        return new TestUser(auth.User.Id, email, Password, client);
    }

    /// <summary>Creates a user with the given roles directly in the database (admins cannot self-register) and logs in.</summary>
    public async Task<TestUser> CreateUserAsync(params string[] roles)
    {
        var email = UniqueEmail(roles.FirstOrDefault()?.ToLowerInvariant() ?? "user");
        var hasher = _factory.Services.GetRequiredService<IPasswordHasher<AppUser>>();

        var user = new AppUser { FirstName = "Test", LastName = string.Join("", roles), Email = email };
        user.PasswordHash = hasher.HashPassword(user, Password);
        foreach (var role in roles)
        {
            user.UserRoles.Add(new UserRole { UserId = user.Id, RoleId = IdentitySeedData.RoleIdFor(role) });
        }

        if (roles.Contains(AppRoles.Instructor))
        {
            user.InstructorProfile = new InstructorProfile { UserId = user.Id };
        }

        await _factory.WithDbAsync(async db =>
        {
            db.AppUsers.Add(user);
            await db.SaveChangesAsync();
        });

        return new TestUser(user.Id, email, Password, await LoginAsync(email, Password));
    }

    public async Task<HttpClient> LoginAsync(string email, string password)
    {
        var client = _factory.CreateClient();
        var response = await client.PostAsJsonAsync("/api/auth/login", new LoginRequest(email, password));
        await response.EnsureStatusAsync(HttpStatusCode.OK);
        var auth = (await response.Content.ReadFromJsonAsync<AuthResponse>())!;
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", auth.AccessToken);
        return client;
    }

    /// <summary>
    /// Published course + future offering with a past session (so attendance can be recorded),
    /// one required resource, one published assignment and the given instructor assigned.
    /// </summary>
    public async Task<TestCohort> CreateCohortAsync(TestUser admin, Guid? instructorId = null, int capacity = 20, decimal price = 1500m)
    {
        var slug = $"course-{Guid.NewGuid():N}";
        var courseResponse = await admin.Client.PostAsJsonAsync("/api/admin/courses",
            new UpsertCourseRequest("Integration Testing 101", slug, "A course created by tests.", PublicationStatuses.Published));
        await courseResponse.EnsureStatusAsync(HttpStatusCode.Created);
        var course = (await courseResponse.Content.ReadFromJsonAsync<AdminCourseDto>())!;

        var now = DateTimeOffset.UtcNow;
        var offeringResponse = await admin.Client.PostAsJsonAsync("/api/admin/offerings",
            new UpsertOfferingRequest(course.Id, now.AddDays(7), now.AddDays(60), "Africa/Cairo", price, "EGP", capacity, OfferingStatuses.Published));
        await offeringResponse.EnsureStatusAsync(HttpStatusCode.Created);
        var offering = (await offeringResponse.Content.ReadFromJsonAsync<AdminOfferingDto>())!;

        var locationResponse = await admin.Client.PostAsJsonAsync("/api/admin/locations",
            new UpsertLocationRequest("Main Campus", "Cairo", null));
        await locationResponse.EnsureStatusAsync(HttpStatusCode.Created);
        var location = (await locationResponse.Content.ReadFromJsonAsync<AdminLocationDto>())!;

        var sessionResponse = await admin.Client.PostAsJsonAsync($"/api/admin/offerings/{offering.Id}/sessions",
            new UpsertSessionRequest("Orientation", now.AddHours(-3), now.AddHours(-1), location.Id, SessionStatuses.Completed));
        await sessionResponse.EnsureStatusAsync(HttpStatusCode.Created);
        var session = (await sessionResponse.Content.ReadFromJsonAsync<AdminSessionDto>())!;

        var resourceResponse = await admin.Client.PostAsJsonAsync($"/api/admin/offerings/{offering.Id}/resources",
            new UpsertResourceRequest("Syllabus", "https://example.org/syllabus", true, 1));
        await resourceResponse.EnsureStatusAsync(HttpStatusCode.Created);
        var resource = (await resourceResponse.Content.ReadFromJsonAsync<AdminResourceDto>())!;

        if (instructorId.HasValue)
        {
            var assign = await admin.Client.PostAsJsonAsync($"/api/admin/offerings/{offering.Id}/instructors",
                new AssignInstructorRequest(instructorId.Value));
            await assign.EnsureStatusAsync(HttpStatusCode.OK);
        }

        // Assignments are authored by instructors; admins are permitted on every cohort.
        var assignmentResponse = await admin.Client.PostAsJsonAsync($"/api/instructor/cohorts/{offering.Id}/assignments",
            new API.DTOs.Learning.UpsertAssignmentRequest("Homework 1", "Answer the questions.", 50m, now.AddDays(14), AssignmentStatuses.Published));
        await assignmentResponse.EnsureStatusAsync(HttpStatusCode.Created);
        var assignment = (await assignmentResponse.Content.ReadFromJsonAsync<API.DTOs.Learning.InstructorAssignmentDto>())!;

        return new TestCohort(course.Id, course.Slug, offering.Id, session.Id, resource.Id, assignment.Id);
    }

    /// <summary>Apply → checkout → simulated successful payment. Returns the payment result.</summary>
    public async Task<PaymentResultDto> EnrollAsync(TestUser learner, Guid offeringId)
    {
        var application = await learner.Client.PostAsJsonAsync("/api/applications", new CreateApplicationRequest(offeringId));
        await application.EnsureStatusAsync(HttpStatusCode.Created);
        var app = (await application.Content.ReadFromJsonAsync<ApplicationDto>())!;

        var orderResponse = await learner.Client.PostAsJsonAsync("/api/payments/orders", new CreateOrderRequest(app.Id));
        await orderResponse.EnsureStatusAsync(HttpStatusCode.OK);
        var order = (await orderResponse.Content.ReadFromJsonAsync<OrderDto>())!;

        var pay = await PayAsync(learner, order.Id, "Succeeded", Guid.NewGuid().ToString("N"));
        await pay.EnsureStatusAsync(HttpStatusCode.OK);
        return (await pay.Content.ReadFromJsonAsync<PaymentResultDto>())!;
    }

    public static Task<HttpResponseMessage> PayAsync(TestUser learner, Guid orderId, string outcome, string idempotencyKey)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, $"/api/payments/orders/{orderId}/simulate")
        {
            Content = JsonContent.Create(new SimulatePaymentRequest(outcome))
        };
        request.Headers.Add("Idempotency-Key", idempotencyKey);
        return learner.Client.SendAsync(request);
    }

    private static string UniqueEmail(string prefix) => $"{prefix}.{Guid.NewGuid():N}@tests.andalusia.local";
}

public static class HttpAssertions
{
    /// <summary>Asserts the status code and includes the response body in the failure message.</summary>
    public static async Task EnsureStatusAsync(this HttpResponseMessage response, HttpStatusCode expected)
    {
        if (response.StatusCode != expected)
        {
            var body = await response.Content.ReadAsStringAsync();
            Assert.Fail($"Expected {(int)expected} {expected} but got {(int)response.StatusCode} {response.StatusCode} for " +
                $"{response.RequestMessage?.Method} {response.RequestMessage?.RequestUri}: {body}");
        }
    }
}
