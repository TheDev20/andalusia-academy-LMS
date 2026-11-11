using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using AndalusiaAcademy.API.DTOs.Learning;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.Tests.Infrastructure;

namespace AndalusiaAcademy.Tests.IntegrationTests.EndToEndSlices;

/// <summary>Instructors attach files to assignments; enrolled learners download them (private, role-checked).</summary>
[Collection(ApiCollection.Name)]
public class AssignmentAttachmentTests
{
    private static readonly byte[] PdfBytes = "%PDF-1.4\n% questions sheet\n%%EOF"u8.ToArray();

    private readonly SqlServerApiFactory _factory;
    private readonly TestScenario _scenario;

    public AssignmentAttachmentTests(SqlServerApiFactory factory)
    {
        _factory = factory;
        _scenario = new TestScenario(factory);
    }

    private sealed record Setup(TestUser Admin, TestUser Instructor, TestUser Learner, TestCohort Cohort);

    private async Task<Setup> ArrangeAsync()
    {
        var admin = await _scenario.CreateUserAsync(AppRoles.Admin);
        var instructor = await _scenario.CreateUserAsync(AppRoles.Instructor);
        var cohort = await _scenario.CreateCohortAsync(admin, instructor.Id);
        var learner = await _scenario.RegisterLearnerAsync();
        await _scenario.EnrollAsync(learner, cohort.OfferingId);
        return new Setup(admin, instructor, learner, cohort);
    }

    private static MultipartFormDataContent Form(params (string Name, byte[] Content)[] files)
    {
        var form = new MultipartFormDataContent();
        foreach (var (name, content) in files)
        {
            var part = new ByteArrayContent(content);
            part.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
            form.Add(part, "Files", name);
        }

        return form;
    }

    private static Task<HttpResponseMessage> UploadAsync(TestUser user, Guid assignmentId, params (string Name, byte[] Content)[] files) =>
        user.Client.PostAsync($"/api/instructor/assignments/{assignmentId}/files", Form(files));

    private static async Task<InstructorAssignmentDto> UploadOkAsync(TestUser user, Guid assignmentId, params (string Name, byte[] Content)[] files)
    {
        var response = await UploadAsync(user, assignmentId, files);
        await response.EnsureStatusAsync(HttpStatusCode.OK);
        return (await response.Content.ReadFromJsonAsync<InstructorAssignmentDto>())!;
    }

    private static Task<HttpResponseMessage> SetStatusAsync(TestUser user, Guid assignmentId, string status) =>
        user.Client.PutAsJsonAsync($"/api/instructor/assignments/{assignmentId}",
            new UpsertAssignmentRequest("Homework 1", "Answer the questions.", 50m, null, status));

    private int StoredObjectCount() =>
        Directory.Exists(_factory.StorageRoot) ? Directory.EnumerateFiles(_factory.StorageRoot, "*", SearchOption.AllDirectories).Count() : 0;

    [Fact]
    public async Task Instructor_attaches_a_file_and_enrolled_learners_can_download_it()
    {
        var s = await ArrangeAsync();

        var assignment = await UploadOkAsync(s.Instructor, s.Cohort.AssignmentId, ("Questions sheet.pdf", PdfBytes));
        var file = Assert.Single(assignment.Files);
        Assert.Equal("Questions sheet.pdf", file.FileName);

        var detail = (await s.Instructor.Client.GetFromJsonAsync<CohortDetailDto>($"/api/instructor/cohorts/{s.Cohort.OfferingId}"))!;
        Assert.Equal(file.Id, Assert.Single(Assert.Single(detail.Assignments).Files).Id);

        var page = (await s.Learner.Client.GetFromJsonAsync<CourseLearningDto>($"/api/learning/courses/{s.Cohort.OfferingId}"))!;
        Assert.Equal(file.Id, Assert.Single(Assert.Single(page.Assignments).Attachments).Id);

        foreach (var user in new[] { s.Learner, s.Instructor, s.Admin })
        {
            var download = await user.Client.GetAsync($"/api/files/{file.Id}");
            await download.EnsureStatusAsync(HttpStatusCode.OK);
            Assert.Equal(PdfBytes, await download.Content.ReadAsByteArrayAsync());
        }
    }

    [Fact]
    public async Task Editing_the_assignment_keeps_its_attachments()
    {
        var s = await ArrangeAsync();
        await UploadOkAsync(s.Instructor, s.Cohort.AssignmentId, ("a.pdf", PdfBytes));

        var update = await SetStatusAsync(s.Instructor, s.Cohort.AssignmentId, AssignmentStatuses.Published);
        await update.EnsureStatusAsync(HttpStatusCode.OK);

        Assert.Single((await update.Content.ReadFromJsonAsync<InstructorAssignmentDto>())!.Files);
    }

    [Fact]
    public async Task Attachments_of_a_draft_assignment_are_hidden_from_learners_until_published()
    {
        var s = await ArrangeAsync();
        var file = Assert.Single((await UploadOkAsync(s.Instructor, s.Cohort.AssignmentId, ("draft.pdf", PdfBytes))).Files);

        await (await SetStatusAsync(s.Instructor, s.Cohort.AssignmentId, AssignmentStatuses.Draft)).EnsureStatusAsync(HttpStatusCode.OK);
        await (await s.Learner.Client.GetAsync($"/api/files/{file.Id}")).EnsureStatusAsync(HttpStatusCode.Forbidden);
        await (await s.Instructor.Client.GetAsync($"/api/files/{file.Id}")).EnsureStatusAsync(HttpStatusCode.OK);

        await (await SetStatusAsync(s.Instructor, s.Cohort.AssignmentId, AssignmentStatuses.Published)).EnsureStatusAsync(HttpStatusCode.OK);
        await (await s.Learner.Client.GetAsync($"/api/files/{file.Id}")).EnsureStatusAsync(HttpStatusCode.OK);
    }

    [Fact]
    public async Task Attachments_are_private_to_the_cohort()
    {
        var s = await ArrangeAsync();
        var file = Assert.Single((await UploadOkAsync(s.Instructor, s.Cohort.AssignmentId, ("q.pdf", PdfBytes))).Files);

        var stranger = await _scenario.RegisterLearnerAsync();
        await (await stranger.Client.GetAsync($"/api/files/{file.Id}")).EnsureStatusAsync(HttpStatusCode.Forbidden);

        var otherInstructor = await _scenario.CreateUserAsync(AppRoles.Instructor);
        await (await otherInstructor.Client.GetAsync($"/api/files/{file.Id}")).EnsureStatusAsync(HttpStatusCode.Forbidden);

        await (await _scenario.Anonymous().GetAsync($"/api/files/{file.Id}")).EnsureStatusAsync(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Only_instructors_of_the_cohort_or_admins_can_attach_or_remove_files()
    {
        var s = await ArrangeAsync();
        var file = Assert.Single((await UploadOkAsync(s.Instructor, s.Cohort.AssignmentId, ("q.pdf", PdfBytes))).Files);
        var otherInstructor = await _scenario.CreateUserAsync(AppRoles.Instructor);

        foreach (var user in new[] { s.Learner, otherInstructor })
        {
            await (await UploadAsync(user, s.Cohort.AssignmentId, ("x.pdf", PdfBytes))).EnsureStatusAsync(HttpStatusCode.Forbidden);
            await (await user.Client.DeleteAsync($"/api/instructor/assignments/{s.Cohort.AssignmentId}/files/{file.Id}"))
                .EnsureStatusAsync(HttpStatusCode.Forbidden);
        }

        await (await _scenario.Anonymous().PostAsync($"/api/instructor/assignments/{s.Cohort.AssignmentId}/files", Form(("x.pdf", PdfBytes))))
            .EnsureStatusAsync(HttpStatusCode.Unauthorized);

        // Admins may act on any cohort.
        await UploadOkAsync(s.Admin, s.Cohort.AssignmentId, ("admin.pdf", PdfBytes));
    }

    [Fact]
    public async Task Bad_uploads_and_over_the_limit_uploads_are_rejected_without_storing_anything()
    {
        var s = await ArrangeAsync();
        var before = StoredObjectCount();

        await (await UploadAsync(s.Instructor, s.Cohort.AssignmentId, ("ok.pdf", PdfBytes), ("run.sh", "#!/bin/sh"u8.ToArray())))
            .EnsureStatusAsync(HttpStatusCode.UnprocessableEntity);
        await (await UploadAsync(s.Instructor, Guid.NewGuid(), ("ok.pdf", PdfBytes))).EnsureStatusAsync(HttpStatusCode.NotFound);
        Assert.Equal(before, StoredObjectCount());

        await UploadOkAsync(s.Instructor, s.Cohort.AssignmentId, Enumerable.Range(0, 5).Select(i => ($"a{i}.pdf", PdfBytes)).ToArray());
        await UploadOkAsync(s.Instructor, s.Cohort.AssignmentId, Enumerable.Range(0, 5).Select(i => ($"b{i}.pdf", PdfBytes)).ToArray());
        var full = StoredObjectCount();
        await (await UploadAsync(s.Instructor, s.Cohort.AssignmentId, ("one-too-many.pdf", PdfBytes))).EnsureStatusAsync(HttpStatusCode.UnprocessableEntity);
        Assert.Equal(full, StoredObjectCount());
    }

    [Fact]
    public async Task Removing_an_attachment_deletes_the_record_and_the_stored_object()
    {
        var s = await ArrangeAsync();
        var two = await UploadOkAsync(s.Instructor, s.Cohort.AssignmentId, ("a.pdf", PdfBytes), ("b.pdf", PdfBytes));
        var victim = two.Files.First(f => f.FileName == "a.pdf");
        var before = StoredObjectCount();

        var response = await s.Instructor.Client.DeleteAsync($"/api/instructor/assignments/{s.Cohort.AssignmentId}/files/{victim.Id}");
        await response.EnsureStatusAsync(HttpStatusCode.OK);

        Assert.Equal("b.pdf", Assert.Single((await response.Content.ReadFromJsonAsync<InstructorAssignmentDto>())!.Files).FileName);
        Assert.Equal(before - 1, StoredObjectCount());
        Assert.False(await _factory.WithDbAsync(db => db.FileAssets.AnyAsync(f => f.Id == victim.Id)));
        await (await s.Learner.Client.GetAsync($"/api/files/{victim.Id}")).EnsureStatusAsync(HttpStatusCode.NotFound);
        await (await s.Instructor.Client.DeleteAsync($"/api/instructor/assignments/{s.Cohort.AssignmentId}/files/{Guid.NewGuid()}"))
            .EnsureStatusAsync(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task The_old_public_upload_endpoint_is_gone()
    {
        var s = await ArrangeAsync();
        var response = await s.Instructor.Client.PostAsync("/api/instructor/upload-attachment", Form(("a.pdf", PdfBytes)));
        Assert.True(response.StatusCode is HttpStatusCode.NotFound or HttpStatusCode.MethodNotAllowed, $"Got {response.StatusCode}");
    }
}
