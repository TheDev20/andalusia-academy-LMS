using System.Net;
using System.Net.Http.Json;
using AndalusiaAcademy.API.DTOs.Common;
using AndalusiaAcademy.API.DTOs.Operations;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.Tests.Infrastructure;

namespace AndalusiaAcademy.Tests.IntegrationTests.ApiContracts;

/// <summary>
/// Sprint 4 Admin/Manager dashboard: students, instructors, courses, schedules and payments.
/// </summary>
[Collection(ApiCollection.Name)]
public class AdminManagementTests
{
    private readonly TestScenario _scenario;

    public AdminManagementTests(SqlServerApiFactory factory)
    {
        _scenario = new TestScenario(factory);
    }

    [Fact]
    public async Task Admin_creates_an_instructor_who_can_log_in_and_be_assigned()
    {
        var admin = await _scenario.CreateUserAsync(AppRoles.Admin);
        var email = $"new.instructor.{Guid.NewGuid():N}@tests.andalusia.local";

        var create = await admin.Client.PostAsJsonAsync("/api/admin/users/instructors",
            new CreateInstructorRequest("Omar", "Teacher", email, "Temp-Passw0rd!", "Data engineer"));
        await create.EnsureStatusAsync(HttpStatusCode.Created);
        var instructor = (await create.Content.ReadFromJsonAsync<AdminUserDto>())!;
        Assert.Equal([AppRoles.Instructor], instructor.Roles);

        var cohort = await _scenario.CreateCohortAsync(admin, instructor.Id);
        var offering = (await admin.Client.GetFromJsonAsync<AdminOfferingDto>($"/api/admin/offerings/{cohort.OfferingId}"))!;
        Assert.Equal(instructor.Id, Assert.Single(offering.Instructors).InstructorId);

        var login = await _scenario.LoginAsync(email, "Temp-Passw0rd!");
        await (await login.GetAsync($"/api/instructor/cohorts/{cohort.OfferingId}")).EnsureStatusAsync(HttpStatusCode.OK);

        var unassign = await admin.Client.DeleteAsync($"/api/admin/offerings/{cohort.OfferingId}/instructors/{instructor.Id}");
        await unassign.EnsureStatusAsync(HttpStatusCode.OK);
        await (await login.GetAsync($"/api/instructor/cohorts/{cohort.OfferingId}")).EnsureStatusAsync(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task Students_can_be_listed_by_role_and_searched()
    {
        var admin = await _scenario.CreateUserAsync(AppRoles.Admin);
        var learner = await _scenario.RegisterLearnerAsync();

        var page = (await admin.Client.GetFromJsonAsync<PagedResult<AdminUserDto>>(
            $"/api/admin/users?role=Learner&search={Uri.EscapeDataString(learner.Email)}"))!;

        var found = Assert.Single(page.Items);
        Assert.Equal(learner.Id, found.Id);
        Assert.True(found.IsActive);
    }

    [Fact]
    public async Task Role_changes_revoke_tokens_and_take_effect_after_login()
    {
        var admin = await _scenario.CreateUserAsync(AppRoles.Admin);
        var learner = await _scenario.RegisterLearnerAsync();

        var promote = await admin.Client.PutAsJsonAsync($"/api/admin/users/{learner.Id}/roles",
            new SetUserRolesRequest([AppRoles.Learner, AppRoles.Instructor]));
        await promote.EnsureStatusAsync(HttpStatusCode.OK);

        await (await learner.Client.GetAsync("/api/me/profile")).EnsureStatusAsync(HttpStatusCode.Unauthorized);
        var relogged = await _scenario.LoginAsync(learner.Email, learner.Password);
        await (await relogged.GetAsync("/api/instructor/cohorts")).EnsureStatusAsync(HttpStatusCode.OK);

        var invalid = await admin.Client.PutAsJsonAsync($"/api/admin/users/{learner.Id}/roles", new SetUserRolesRequest(["Root"]));
        await invalid.EnsureStatusAsync(HttpStatusCode.UnprocessableEntity);

        var selfDemote = await admin.Client.PutAsJsonAsync($"/api/admin/users/{admin.Id}/roles", new SetUserRolesRequest([AppRoles.Learner]));
        await selfDemote.EnsureStatusAsync(HttpStatusCode.UnprocessableEntity);
    }

    [Fact]
    public async Task Course_crud_protects_scheduled_courses()
    {
        var admin = await _scenario.CreateUserAsync(AppRoles.Admin);
        var slug = $"crud-{Guid.NewGuid():N}";

        var created = (await (await admin.Client.PostAsJsonAsync("/api/admin/courses",
            new UpsertCourseRequest("Draft course", slug, "Desc", PublicationStatuses.Draft))).Content.ReadFromJsonAsync<AdminCourseDto>())!;

        var duplicate = await admin.Client.PostAsJsonAsync("/api/admin/courses",
            new UpsertCourseRequest("Other", slug, "Desc", PublicationStatuses.Draft));
        await duplicate.EnsureStatusAsync(HttpStatusCode.Conflict);

        var updated = await admin.Client.PutAsJsonAsync($"/api/admin/courses/{created.Id}",
            new UpsertCourseRequest("Renamed course", slug, "New desc", PublicationStatuses.Published));
        await updated.EnsureStatusAsync(HttpStatusCode.OK);
        Assert.Equal("Renamed course", (await updated.Content.ReadFromJsonAsync<AdminCourseDto>())!.Title);

        await (await admin.Client.DeleteAsync($"/api/admin/courses/{created.Id}")).EnsureStatusAsync(HttpStatusCode.NoContent);
        await (await admin.Client.GetAsync($"/api/admin/courses/{created.Id}")).EnsureStatusAsync(HttpStatusCode.NotFound);

        var cohort = await _scenario.CreateCohortAsync(admin);
        await (await admin.Client.DeleteAsync($"/api/admin/courses/{cohort.CourseId}")).EnsureStatusAsync(HttpStatusCode.Conflict);
    }

    [Fact]
    public async Task Capacity_cannot_drop_below_taken_seats()
    {
        var admin = await _scenario.CreateUserAsync(AppRoles.Admin);
        var cohort = await _scenario.CreateCohortAsync(admin, capacity: 2);
        await _scenario.EnrollAsync(await _scenario.RegisterLearnerAsync(), cohort.OfferingId);
        await _scenario.EnrollAsync(await _scenario.RegisterLearnerAsync(), cohort.OfferingId);

        var offering = (await admin.Client.GetFromJsonAsync<AdminOfferingDto>($"/api/admin/offerings/{cohort.OfferingId}"))!;
        Assert.Equal(2, offering.SeatsTaken);

        var shrink = await admin.Client.PutAsJsonAsync($"/api/admin/offerings/{cohort.OfferingId}",
            new UpsertOfferingRequest(cohort.CourseId, offering.StartsAt, offering.EndsAt, offering.TimeZoneId,
                offering.Price, offering.Currency, 1, offering.Status));
        await shrink.EnsureStatusAsync(HttpStatusCode.UnprocessableEntity);
    }

    [Fact]
    public async Task Sessions_with_attendance_cannot_be_deleted()
    {
        var admin = await _scenario.CreateUserAsync(AppRoles.Admin);
        var cohort = await _scenario.CreateCohortAsync(admin);
        var learner = await _scenario.RegisterLearnerAsync();
        await _scenario.EnrollAsync(learner, cohort.OfferingId);
        var detail = (await admin.Client.GetFromJsonAsync<API.DTOs.Learning.CohortDetailDto>($"/api/instructor/cohorts/{cohort.OfferingId}"))!;

        await (await admin.Client.PutAsJsonAsync($"/api/instructor/sessions/{cohort.PastSessionId}/attendance",
            new API.DTOs.Learning.RecordAttendanceRequest([new(detail.Roster[0].LearningEnrollmentId, AttendanceStatuses.Present, null)])))
            .EnsureStatusAsync(HttpStatusCode.OK);

        await (await admin.Client.DeleteAsync($"/api/admin/sessions/{cohort.PastSessionId}")).EnsureStatusAsync(HttpStatusCode.Conflict);
    }

    [Fact]
    public async Task Payments_are_visible_to_admins_with_filters()
    {
        var admin = await _scenario.CreateUserAsync(AppRoles.Admin);
        var cohort = await _scenario.CreateCohortAsync(admin, price: 999m);
        var learner = await _scenario.RegisterLearnerAsync();
        await _scenario.EnrollAsync(learner, cohort.OfferingId);

        var page = (await admin.Client.GetFromJsonAsync<PagedResult<AdminOrderDto>>(
            $"/api/admin/payments/orders?status=Paid&search={Uri.EscapeDataString(learner.Email)}"))!;

        var order = Assert.Single(page.Items);
        Assert.Equal(999m, order.AmountDue);
        Assert.Equal(1, order.AttemptCount);
        Assert.NotNull(order.PaidAt);
    }

    [Fact]
    public async Task Admin_cannot_deactivate_themselves()
    {
        var admin = await _scenario.CreateUserAsync(AppRoles.Admin);

        var response = await admin.Client.PutAsJsonAsync($"/api/admin/users/{admin.Id}/status", new SetUserStatusRequest(false));

        await response.EnsureStatusAsync(HttpStatusCode.UnprocessableEntity);
        await (await admin.Client.GetAsync("/api/me/profile")).EnsureStatusAsync(HttpStatusCode.OK);
    }
}
