using System.Net;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using AndalusiaAcademy.API.DTOs.Learning;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.Tests.Infrastructure;

namespace AndalusiaAcademy.Tests.IntegrationTests.EndToEndSlices;

/// <summary>
/// Sprint 4 Definition of Done: learner LMS → instructor attendance/assignments → progress tracking.
/// </summary>
[Collection(ApiCollection.Name)]
public class LearningOperationsTests
{
    private readonly SqlServerApiFactory _factory;
    private readonly TestScenario _scenario;

    public LearningOperationsTests(SqlServerApiFactory factory)
    {
        _factory = factory;
        _scenario = new TestScenario(factory);
    }

    [Fact]
    public async Task Learner_and_instructor_run_a_cohort_end_to_end()
    {
        var admin = await _scenario.CreateUserAsync(AppRoles.Admin);
        var instructor = await _scenario.CreateUserAsync(AppRoles.Instructor);
        var cohort = await _scenario.CreateCohortAsync(admin, instructor.Id);
        var learner = await _scenario.RegisterLearnerAsync();
        await _scenario.EnrollAsync(learner, cohort.OfferingId);

        // Learner: materials and sessions, then completes a resource and submits the assignment.
        var page = (await learner.Client.GetFromJsonAsync<CourseLearningDto>($"/api/learning/courses/{cohort.OfferingId}"))!;
        Assert.Single(page.Instructors);
        Assert.Null(page.Resources[0].CompletedAt);
        Assert.Equal(0m, page.Progress.OverallPercent);

        await (await learner.Client.PostAsync($"/api/learning/resources/{cohort.ResourceId}/complete", null)).EnsureStatusAsync(HttpStatusCode.OK);
        await (await learner.Client.PostAsync($"/api/learning/resources/{cohort.ResourceId}/complete", null)).EnsureStatusAsync(HttpStatusCode.OK);

        var submitResponse = await learner.Client.PostAsJsonAsync($"/api/learning/assignments/{cohort.AssignmentId}/submissions",
            new SubmitAssignmentRequest("My answers"));
        await submitResponse.EnsureStatusAsync(HttpStatusCode.Created);
        var submission = (await submitResponse.Content.ReadFromJsonAsync<SubmissionDto>())!;
        Assert.Equal(1, submission.AttemptNumber);

        var resubmit = (await (await learner.Client.PostAsJsonAsync($"/api/learning/assignments/{cohort.AssignmentId}/submissions",
            new SubmitAssignmentRequest("Improved answers"))).Content.ReadFromJsonAsync<SubmissionDto>())!;
        Assert.Equal(2, resubmit.AttemptNumber);

        // Instructor: cohort overview, attendance, grading.
        var cohorts = (await instructor.Client.GetFromJsonAsync<List<CohortDto>>("/api/instructor/cohorts"))!;
        var mine = Assert.Single(cohorts);
        Assert.Equal(1, mine.LearnerCount);

        var detail = (await instructor.Client.GetFromJsonAsync<CohortDetailDto>($"/api/instructor/cohorts/{cohort.OfferingId}"))!;
        var rosterEntry = Assert.Single(detail.Roster);
        Assert.Equal(learner.Id, rosterEntry.LearnerId);

        var attendance = await instructor.Client.PutAsJsonAsync($"/api/instructor/sessions/{cohort.PastSessionId}/attendance",
            new RecordAttendanceRequest([new AttendanceEntry(rosterEntry.LearningEnrollmentId, AttendanceStatuses.Absent, null)]));
        await attendance.EnsureStatusAsync(HttpStatusCode.OK);

        // Correcting attendance is audited.
        var corrected = await instructor.Client.PutAsJsonAsync($"/api/instructor/sessions/{cohort.PastSessionId}/attendance",
            new RecordAttendanceRequest([new AttendanceEntry(rosterEntry.LearningEnrollmentId, AttendanceStatuses.Late, "Arrived after roll call")]));
        await corrected.EnsureStatusAsync(HttpStatusCode.OK);
        var sheet = (await corrected.Content.ReadFromJsonAsync<SessionAttendanceDto>())!;
        Assert.Equal(AttendanceStatuses.Late, Assert.Single(sheet.Records).Status);

        var correction = await _factory.WithDbAsync(db => db.AttendanceCorrections
            .SingleAsync(c => c.SessionId == cohort.PastSessionId && c.LearningEnrollmentId == rosterEntry.LearningEnrollmentId));
        Assert.Equal(AttendanceStatuses.Absent, correction.OldStatus);
        Assert.Equal(AttendanceStatuses.Late, correction.NewStatus);
        Assert.Equal(instructor.Id, correction.ActorUserId);

        var submissions = (await instructor.Client.GetFromJsonAsync<List<SubmissionForGradingDto>>(
            $"/api/instructor/assignments/{cohort.AssignmentId}/submissions"))!;
        Assert.Equal(2, submissions.Count);

        var overMax = await instructor.Client.PostAsJsonAsync($"/api/instructor/submissions/{resubmit.Id}/grade", new GradeSubmissionRequest(51m));
        await overMax.EnsureStatusAsync(HttpStatusCode.UnprocessableEntity);
        var grade = await instructor.Client.PostAsJsonAsync($"/api/instructor/submissions/{resubmit.Id}/grade", new GradeSubmissionRequest(45m));
        await grade.EnsureStatusAsync(HttpStatusCode.OK);

        // Progress, seen from both sides: resource 100%, attendance 100% (Late counts), assignment 100%.
        var progress = Assert.Single((await instructor.Client.GetFromJsonAsync<List<LearnerProgressDto>>(
            $"/api/instructor/cohorts/{cohort.OfferingId}/progress"))!);
        Assert.Equal(100m, progress.Progress.OverallPercent);

        page = (await learner.Client.GetFromJsonAsync<CourseLearningDto>($"/api/learning/courses/{cohort.OfferingId}"))!;
        Assert.Equal(AttendanceStatuses.Late, page.Sessions.Single().MyAttendance);
        Assert.NotNull(page.Resources.Single().CompletedAt);
        Assert.Equal(45m, page.Assignments.Single().LatestSubmission!.Score);
        Assert.Equal(100m, page.Progress.OverallPercent);

        var myCourses = (await learner.Client.GetFromJsonAsync<List<MyCourseDto>>("/api/learning/courses"))!;
        Assert.Equal(100m, Assert.Single(myCourses).Progress.OverallPercent);
    }

    [Fact]
    public async Task Attendance_only_accepts_learners_actively_enrolled_in_the_cohort()
    {
        var admin = await _scenario.CreateUserAsync(AppRoles.Admin);
        var instructor = await _scenario.CreateUserAsync(AppRoles.Instructor);
        var cohort = await _scenario.CreateCohortAsync(admin, instructor.Id);
        var otherCohort = await _scenario.CreateCohortAsync(admin);
        var learner = await _scenario.RegisterLearnerAsync();
        await _scenario.EnrollAsync(learner, otherCohort.OfferingId);
        var foreignEnrollmentId = await _factory.WithDbAsync(db =>
            db.LearningEnrollments.Where(le => le.LearnerId == learner.Id).Select(le => le.Id).SingleAsync());

        var response = await instructor.Client.PutAsJsonAsync($"/api/instructor/sessions/{cohort.PastSessionId}/attendance",
            new RecordAttendanceRequest([new AttendanceEntry(foreignEnrollmentId, AttendanceStatuses.Present, null)]));

        await response.EnsureStatusAsync(HttpStatusCode.UnprocessableEntity);
    }

    [Fact]
    public async Task Draft_assignments_are_hidden_from_learners_and_closed_ones_reject_submissions()
    {
        var admin = await _scenario.CreateUserAsync(AppRoles.Admin);
        var instructor = await _scenario.CreateUserAsync(AppRoles.Instructor);
        var cohort = await _scenario.CreateCohortAsync(admin, instructor.Id);
        var learner = await _scenario.RegisterLearnerAsync();
        await _scenario.EnrollAsync(learner, cohort.OfferingId);

        var draft = await instructor.Client.PostAsJsonAsync($"/api/instructor/cohorts/{cohort.OfferingId}/assignments",
            new UpsertAssignmentRequest("Draft work", "Not yet", 10m, null, AssignmentStatuses.Draft));
        await draft.EnsureStatusAsync(HttpStatusCode.Created);

        var page = (await learner.Client.GetFromJsonAsync<CourseLearningDto>($"/api/learning/courses/{cohort.OfferingId}"))!;
        Assert.Single(page.Assignments);

        var close = await instructor.Client.PutAsJsonAsync($"/api/instructor/assignments/{cohort.AssignmentId}",
            new UpsertAssignmentRequest("Homework 1", "Answer the questions.", 50m, null, AssignmentStatuses.Closed));
        await close.EnsureStatusAsync(HttpStatusCode.OK);

        var submit = await learner.Client.PostAsJsonAsync($"/api/learning/assignments/{cohort.AssignmentId}/submissions",
            new SubmitAssignmentRequest("Too late"));
        await submit.EnsureStatusAsync(HttpStatusCode.UnprocessableEntity);
    }

    [Fact]
    public async Task Attendance_cannot_be_recorded_before_a_session_starts()
    {
        var admin = await _scenario.CreateUserAsync(AppRoles.Admin);
        var cohort = await _scenario.CreateCohortAsync(admin);
        var learner = await _scenario.RegisterLearnerAsync();
        await _scenario.EnrollAsync(learner, cohort.OfferingId);
        var now = DateTimeOffset.UtcNow;

        var future = (await (await admin.Client.PostAsJsonAsync($"/api/admin/offerings/{cohort.OfferingId}/sessions",
            new API.DTOs.Operations.UpsertSessionRequest("Next week", now.AddDays(7), now.AddDays(7).AddHours(2), null, SessionStatuses.Scheduled)))
            .Content.ReadFromJsonAsync<API.DTOs.Operations.AdminSessionDto>())!;
        var enrollmentId = await _factory.WithDbAsync(db =>
            db.LearningEnrollments.Where(le => le.LearnerId == learner.Id).Select(le => le.Id).SingleAsync());

        var response = await admin.Client.PutAsJsonAsync($"/api/instructor/sessions/{future.Id}/attendance",
            new RecordAttendanceRequest([new AttendanceEntry(enrollmentId, AttendanceStatuses.Present, null)]));

        await response.EnsureStatusAsync(HttpStatusCode.UnprocessableEntity);
    }
}
