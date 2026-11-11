using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using AndalusiaAcademy.API.DTOs.Common;
using AndalusiaAcademy.API.DTOs.Learning;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.API.Services.Interfaces.Storage;
using AndalusiaAcademy.Tests.Infrastructure;

namespace AndalusiaAcademy.Tests.IntegrationTests.EndToEndSlices;

/// <summary>
/// Learner and instructor file uploads: submissions with files, private authorised downloads and upload rejection.
/// </summary>
[Collection(ApiCollection.Name)]
public class FileUploadTests
{
    private static readonly byte[] PdfBytes = "%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF"u8.ToArray();

    private readonly SqlServerApiFactory _factory;
    private readonly TestScenario _scenario;

    public FileUploadTests(SqlServerApiFactory factory)
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

    private static MultipartFormDataContent Form(string? body, params (string Name, byte[] Content)[] files)
    {
        var form = new MultipartFormDataContent();
        if (body is not null)
        {
            form.Add(new StringContent(body), "Body");
        }

        foreach (var (name, content) in files)
        {
            var part = new ByteArrayContent(content);
            part.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
            form.Add(part, "Files", name);
        }

        return form;
    }

    private static Task<HttpResponseMessage> SubmitAsync(TestUser learner, Guid assignmentId, MultipartFormDataContent form) =>
        learner.Client.PostAsync($"/api/learning/assignments/{assignmentId}/submissions/upload", form);

    private static async Task<SubmissionDto> SubmitOkAsync(TestUser learner, Guid assignmentId, MultipartFormDataContent form)
    {
        var response = await SubmitAsync(learner, assignmentId, form);
        await response.EnsureStatusAsync(HttpStatusCode.Created);
        return (await response.Content.ReadFromJsonAsync<SubmissionDto>())!;
    }

    private int StoredObjectCount() =>
        Directory.Exists(_factory.StorageRoot) ? Directory.EnumerateFiles(_factory.StorageRoot, "*", SearchOption.AllDirectories).Count() : 0;

    [Fact]
    public async Task Learner_submits_text_and_files_and_instructor_downloads_them()
    {
        var s = await ArrangeAsync();

        var submission = await SubmitOkAsync(s.Learner, s.Cohort.AssignmentId, Form("See attached.", ("report final.pdf", PdfBytes)));
        var file = Assert.Single(submission.Files);
        Assert.Equal("report final.pdf", file.FileName);
        Assert.Equal("application/pdf", file.MediaType);
        Assert.Equal(PdfBytes.Length, file.SizeBytes);

        // The learner sees the file on their course page.
        var page = (await s.Learner.Client.GetFromJsonAsync<CourseLearningDto>($"/api/learning/courses/{s.Cohort.OfferingId}"))!;
        var latest = Assert.Single(page.Assignments).LatestSubmission!;
        Assert.Equal(file.Id, Assert.Single(latest.Files).Id);

        // The instructor sees it on the grading list and can download the exact bytes.
        var forGrading = Assert.Single((await s.Instructor.Client.GetFromJsonAsync<List<SubmissionForGradingDto>>(
            $"/api/instructor/assignments/{s.Cohort.AssignmentId}/submissions"))!);
        Assert.Equal(file.Id, Assert.Single(forGrading.Files).Id);

        var download = await s.Instructor.Client.GetAsync($"/api/files/{file.Id}");
        await download.EnsureStatusAsync(HttpStatusCode.OK);
        Assert.Equal(PdfBytes, await download.Content.ReadAsByteArrayAsync());
        Assert.Equal("application/pdf", download.Content.Headers.ContentType?.MediaType);
        Assert.Equal("attachment", download.Content.Headers.ContentDisposition?.DispositionType);
        Assert.Equal("report final.pdf", download.Content.Headers.ContentDisposition?.FileNameStar ?? download.Content.Headers.ContentDisposition?.FileName?.Trim('"'));
        Assert.Equal("nosniff", download.Headers.GetValues("X-Content-Type-Options").Single());

        // The owner can read their own upload; an admin can read everything.
        await (await s.Learner.Client.GetAsync($"/api/files/{file.Id}")).EnsureStatusAsync(HttpStatusCode.OK);
        await (await s.Admin.Client.GetAsync($"/api/files/{file.Id}")).EnsureStatusAsync(HttpStatusCode.OK);

        // Grading keeps the files attached to the returned submission.
        var graded = await s.Instructor.Client.PostAsJsonAsync($"/api/instructor/submissions/{submission.Id}/grade", new GradeSubmissionRequest(40m));
        await graded.EnsureStatusAsync(HttpStatusCode.OK);
        Assert.Single((await graded.Content.ReadFromJsonAsync<SubmissionForGradingDto>())!.Files);
    }

    [Fact]
    public async Task Files_only_and_text_only_submissions_are_both_accepted_and_empty_ones_are_not()
    {
        var s = await ArrangeAsync();

        Assert.Single((await SubmitOkAsync(s.Learner, s.Cohort.AssignmentId, Form(null, ("a.pdf", PdfBytes)))).Files);
        Assert.Empty((await SubmitOkAsync(s.Learner, s.Cohort.AssignmentId, Form("just text"))).Files);

        var empty = await SubmitAsync(s.Learner, s.Cohort.AssignmentId, Form("   "));
        await empty.EnsureStatusAsync(HttpStatusCode.UnprocessableEntity);
    }

    [Fact]
    public async Task Attempt_numbers_keep_counting_across_json_and_multipart_submissions()
    {
        var s = await ArrangeAsync();

        var first = await s.Learner.Client.PostAsJsonAsync($"/api/learning/assignments/{s.Cohort.AssignmentId}/submissions",
            new SubmitAssignmentRequest("json answer"));
        await first.EnsureStatusAsync(HttpStatusCode.Created);
        var second = await SubmitOkAsync(s.Learner, s.Cohort.AssignmentId, Form("with file", ("a.pdf", PdfBytes)));

        Assert.Equal(2, second.AttemptNumber);
    }

    [Theory]
    [InlineData("setup.exe", "MZ-not-a-document")]
    [InlineData("invoice.pdf", "MZ-this-is-an-executable")]
    [InlineData("page.html", "<script>alert(1)</script>")]
    public async Task Disallowed_or_disguised_files_are_rejected_and_nothing_is_stored(string name, string content)
    {
        var s = await ArrangeAsync();
        var before = StoredObjectCount();

        // A valid file alongside a bad one: the whole upload must be rejected, not half-saved.
        var form = Form("answer", ("good.pdf", PdfBytes), (name, System.Text.Encoding.ASCII.GetBytes(content)));
        var response = await SubmitAsync(s.Learner, s.Cohort.AssignmentId, form);

        await response.EnsureStatusAsync(HttpStatusCode.UnprocessableEntity);
        Assert.Equal(before, StoredObjectCount());
        var page = (await s.Learner.Client.GetFromJsonAsync<CourseLearningDto>($"/api/learning/courses/{s.Cohort.OfferingId}"))!;
        Assert.Null(Assert.Single(page.Assignments).LatestSubmission);
    }

    [Fact]
    public async Task Empty_files_oversized_files_and_too_many_files_are_rejected()
    {
        var s = await ArrangeAsync();

        await (await SubmitAsync(s.Learner, s.Cohort.AssignmentId, Form("x", ("empty.pdf", []))))
            .EnsureStatusAsync(HttpStatusCode.UnprocessableEntity);

        var tooBig = new byte[UploadLimits.MaxFileBytes + 1];
        PdfBytes.CopyTo(tooBig, 0);
        await (await SubmitAsync(s.Learner, s.Cohort.AssignmentId, Form("x", ("big.pdf", tooBig))))
            .EnsureStatusAsync(HttpStatusCode.UnprocessableEntity);

        var six = Enumerable.Range(0, UploadLimits.MaxFilesPerUpload + 1).Select(i => ($"f{i}.pdf", PdfBytes)).ToArray();
        await (await SubmitAsync(s.Learner, s.Cohort.AssignmentId, Form("x", six)))
            .EnsureStatusAsync(HttpStatusCode.UnprocessableEntity);
    }

    [Fact]
    public async Task Submitting_to_a_closed_assignment_stores_no_files()
    {
        var s = await ArrangeAsync();
        var close = await s.Instructor.Client.PutAsJsonAsync($"/api/instructor/assignments/{s.Cohort.AssignmentId}",
            new UpsertAssignmentRequest("Homework 1", "Answer the questions.", 50m, null, AssignmentStatuses.Closed));
        await close.EnsureStatusAsync(HttpStatusCode.OK);
        var before = StoredObjectCount();

        var response = await SubmitAsync(s.Learner, s.Cohort.AssignmentId, Form("late", ("a.pdf", PdfBytes)));

        await response.EnsureStatusAsync(HttpStatusCode.UnprocessableEntity);
        Assert.Equal(before, StoredObjectCount());
    }

    [Fact]
    public async Task Other_users_cannot_read_a_learners_submission_files()
    {
        var s = await ArrangeAsync();
        var file = Assert.Single((await SubmitOkAsync(s.Learner, s.Cohort.AssignmentId, Form("x", ("secret.pdf", PdfBytes)))).Files);

        // Another learner enrolled in the same cohort.
        var classmate = await _scenario.RegisterLearnerAsync();
        await _scenario.EnrollAsync(classmate, s.Cohort.OfferingId);
        await (await classmate.Client.GetAsync($"/api/files/{file.Id}")).EnsureStatusAsync(HttpStatusCode.Forbidden);

        // A learner who is not enrolled at all.
        var stranger = await _scenario.RegisterLearnerAsync();
        await (await stranger.Client.GetAsync($"/api/files/{file.Id}")).EnsureStatusAsync(HttpStatusCode.Forbidden);

        // An instructor of a different cohort.
        var otherInstructor = await _scenario.CreateUserAsync(AppRoles.Instructor);
        await (await otherInstructor.Client.GetAsync($"/api/files/{file.Id}")).EnsureStatusAsync(HttpStatusCode.Forbidden);

        // Anonymous callers are not authenticated, and the old anonymous upload route never serves these files.
        await (await _scenario.Anonymous().GetAsync($"/api/files/{file.Id}")).EnsureStatusAsync(HttpStatusCode.Unauthorized);
        await (await _scenario.Anonymous().GetAsync($"/api/uploads/{file.Id}")).EnsureStatusAsync(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Unknown_file_ids_return_not_found()
    {
        var s = await ArrangeAsync();
        await (await s.Learner.Client.GetAsync($"/api/files/{Guid.NewGuid()}")).EnsureStatusAsync(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task A_learner_who_is_not_enrolled_cannot_submit_files()
    {
        var s = await ArrangeAsync();
        var stranger = await _scenario.RegisterLearnerAsync();
        var before = StoredObjectCount();

        var response = await SubmitAsync(stranger, s.Cohort.AssignmentId, Form("x", ("a.pdf", PdfBytes)));

        await response.EnsureStatusAsync(HttpStatusCode.Forbidden);
        Assert.Equal(before, StoredObjectCount());
    }

    [Fact]
    public async Task Stored_objects_use_opaque_keys_outside_the_web_root()
    {
        var s = await ArrangeAsync();
        await SubmitOkAsync(s.Learner, s.Cohort.AssignmentId, Form("x", ("my name.pdf", PdfBytes)));

        var stored = Directory.EnumerateFiles(_factory.StorageRoot, "*", SearchOption.AllDirectories).ToList();
        Assert.NotEmpty(stored);
        Assert.All(stored, path =>
        {
            Assert.DoesNotContain("my name", path);
            Assert.Matches(@"[0-9a-f]{32}$", Path.GetFileName(path));
        });
    }
}
