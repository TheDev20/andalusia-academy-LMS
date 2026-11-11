using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using AndalusiaAcademy.API.DTOs.Learning;
using AndalusiaAcademy.API.DTOs.Operations;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.API.Services.Interfaces.Storage;
using AndalusiaAcademy.Tests.Infrastructure;

namespace AndalusiaAcademy.Tests.IntegrationTests.EndToEndSlices;

/// <summary>Learning materials with uploaded documents: admin uploads, enrolled learners download.</summary>
[Collection(ApiCollection.Name)]
public class MaterialFileTests
{
    private static readonly byte[] PdfBytes = "%PDF-1.4\n% lecture notes\n%%EOF"u8.ToArray();

    private readonly SqlServerApiFactory _factory;
    private readonly TestScenario _scenario;

    public MaterialFileTests(SqlServerApiFactory factory)
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

    private static Task<HttpResponseMessage> UploadAsync(TestUser user, Guid resourceId, params (string Name, byte[] Content)[] files) =>
        user.Client.PostAsync($"/api/admin/offerings/resources/{resourceId}/files", Form(files));

    private static async Task<AdminResourceDto> UploadOkAsync(TestUser user, Guid resourceId, params (string Name, byte[] Content)[] files)
    {
        var response = await UploadAsync(user, resourceId, files);
        await response.EnsureStatusAsync(HttpStatusCode.OK);
        return (await response.Content.ReadFromJsonAsync<AdminResourceDto>())!;
    }

    private int StoredObjectCount() =>
        Directory.Exists(_factory.StorageRoot) ? Directory.EnumerateFiles(_factory.StorageRoot, "*", SearchOption.AllDirectories).Count() : 0;

    [Fact]
    public async Task Admin_uploads_a_document_and_enrolled_learners_and_staff_can_download_it()
    {
        var s = await ArrangeAsync();

        var resource = await UploadOkAsync(s.Admin, s.Cohort.ResourceId, ("Week 1 notes.pdf", PdfBytes));
        var file = Assert.Single(resource.Files);
        Assert.Equal("Week 1 notes.pdf", file.FileName);
        Assert.Equal("https://example.org/syllabus", resource.Url); // the link is kept alongside the document

        var listed = Assert.Single((await s.Admin.Client.GetFromJsonAsync<List<AdminResourceDto>>($"/api/admin/offerings/{s.Cohort.OfferingId}/resources"))!);
        Assert.Equal(file.Id, Assert.Single(listed.Files).Id);

        var page = (await s.Learner.Client.GetFromJsonAsync<CourseLearningDto>($"/api/learning/courses/{s.Cohort.OfferingId}"))!;
        Assert.Equal(file.Id, Assert.Single(Assert.Single(page.Resources).Files).Id);

        foreach (var user in new[] { s.Learner, s.Instructor, s.Admin })
        {
            var download = await user.Client.GetAsync($"/api/files/{file.Id}");
            await download.EnsureStatusAsync(HttpStatusCode.OK);
            Assert.Equal(PdfBytes, await download.Content.ReadAsByteArrayAsync());
            Assert.Equal("attachment", download.Content.Headers.ContentDisposition?.DispositionType);
        }

        // Completing the material (idempotent) still reports its files.
        var done = (await (await s.Learner.Client.PostAsync($"/api/learning/resources/{s.Cohort.ResourceId}/complete", null))
            .Content.ReadFromJsonAsync<LearnerResourceDto>())!;
        Assert.Single(done.Files);
    }

    [Fact]
    public async Task Material_files_are_private_to_the_offering()
    {
        var s = await ArrangeAsync();
        var file = Assert.Single((await UploadOkAsync(s.Admin, s.Cohort.ResourceId, ("notes.pdf", PdfBytes))).Files);

        var stranger = await _scenario.RegisterLearnerAsync();
        await (await stranger.Client.GetAsync($"/api/files/{file.Id}")).EnsureStatusAsync(HttpStatusCode.Forbidden);

        var otherInstructor = await _scenario.CreateUserAsync(AppRoles.Instructor);
        await (await otherInstructor.Client.GetAsync($"/api/files/{file.Id}")).EnsureStatusAsync(HttpStatusCode.Forbidden);

        await (await _scenario.Anonymous().GetAsync($"/api/files/{file.Id}")).EnsureStatusAsync(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Only_admins_can_upload_or_remove_material_files()
    {
        var s = await ArrangeAsync();
        var file = Assert.Single((await UploadOkAsync(s.Admin, s.Cohort.ResourceId, ("notes.pdf", PdfBytes))).Files);

        foreach (var user in new[] { s.Learner, s.Instructor })
        {
            await (await UploadAsync(user, s.Cohort.ResourceId, ("x.pdf", PdfBytes))).EnsureStatusAsync(HttpStatusCode.Forbidden);
            await (await user.Client.DeleteAsync($"/api/admin/offerings/resources/{s.Cohort.ResourceId}/files/{file.Id}"))
                .EnsureStatusAsync(HttpStatusCode.Forbidden);
        }

        await (await _scenario.Anonymous().PostAsync($"/api/admin/offerings/resources/{s.Cohort.ResourceId}/files", Form(("x.pdf", PdfBytes))))
            .EnsureStatusAsync(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Bad_uploads_are_rejected_without_storing_anything()
    {
        var s = await ArrangeAsync();
        var before = StoredObjectCount();

        await (await UploadAsync(s.Admin, s.Cohort.ResourceId, ("ok.pdf", PdfBytes), ("tool.exe", "MZ\0\0"u8.ToArray())))
            .EnsureStatusAsync(HttpStatusCode.UnprocessableEntity);

        // A well-formed form that carries no files at all.
        var noFiles = new MultipartFormDataContent { { new StringContent("nothing"), "Note" } };
        await (await s.Admin.Client.PostAsync($"/api/admin/offerings/resources/{s.Cohort.ResourceId}/files", noFiles))
            .EnsureStatusAsync(HttpStatusCode.UnprocessableEntity);
        await (await UploadAsync(s.Admin, Guid.NewGuid(), ("ok.pdf", PdfBytes))).EnsureStatusAsync(HttpStatusCode.NotFound);

        Assert.Equal(before, StoredObjectCount());
    }

    [Fact]
    public async Task A_material_holds_at_most_ten_files()
    {
        var s = await ArrangeAsync();
        await UploadOkAsync(s.Admin, s.Cohort.ResourceId, Enumerable.Range(0, 5).Select(i => ($"a{i}.pdf", PdfBytes)).ToArray());
        await UploadOkAsync(s.Admin, s.Cohort.ResourceId, Enumerable.Range(0, 5).Select(i => ($"b{i}.pdf", PdfBytes)).ToArray());
        var before = StoredObjectCount();

        await (await UploadAsync(s.Admin, s.Cohort.ResourceId, ("one-too-many.pdf", PdfBytes))).EnsureStatusAsync(HttpStatusCode.UnprocessableEntity);

        Assert.Equal(before, StoredObjectCount());
    }

    [Fact]
    public async Task Removing_a_file_deletes_the_record_and_the_stored_object()
    {
        var s = await ArrangeAsync();
        var two = await UploadOkAsync(s.Admin, s.Cohort.ResourceId, ("a.pdf", PdfBytes), ("b.pdf", PdfBytes));
        var before = StoredObjectCount();
        var victim = two.Files.First(f => f.FileName == "a.pdf");

        var response = await s.Admin.Client.DeleteAsync($"/api/admin/offerings/resources/{s.Cohort.ResourceId}/files/{victim.Id}");
        await response.EnsureStatusAsync(HttpStatusCode.OK);
        var remaining = (await response.Content.ReadFromJsonAsync<AdminResourceDto>())!;

        Assert.Equal("b.pdf", Assert.Single(remaining.Files).FileName);
        Assert.Equal(before - 1, StoredObjectCount());
        Assert.False(await _factory.WithDbAsync(db => db.FileAssets.AnyAsync(f => f.Id == victim.Id)));
        await (await s.Learner.Client.GetAsync($"/api/files/{victim.Id}")).EnsureStatusAsync(HttpStatusCode.NotFound);

        // A file id from elsewhere, or one that does not belong to this material, is not found.
        await (await s.Admin.Client.DeleteAsync($"/api/admin/offerings/resources/{s.Cohort.ResourceId}/files/{Guid.NewGuid()}"))
            .EnsureStatusAsync(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Deleting_a_material_removes_its_files_but_a_completed_material_cannot_be_deleted()
    {
        var s = await ArrangeAsync();
        var resource = await UploadOkAsync(s.Admin, s.Cohort.ResourceId, ("a.pdf", PdfBytes));
        var fileId = Assert.Single(resource.Files).Id;
        var before = StoredObjectCount();

        // A learner completed it, so deletion is refused and the file stays.
        await (await s.Learner.Client.PostAsync($"/api/learning/resources/{s.Cohort.ResourceId}/complete", null)).EnsureStatusAsync(HttpStatusCode.OK);
        await (await s.Admin.Client.DeleteAsync($"/api/admin/offerings/resources/{s.Cohort.ResourceId}")).EnsureStatusAsync(HttpStatusCode.Conflict);
        Assert.Equal(before, StoredObjectCount());

        // A fresh material with a file deletes cleanly.
        var created = await s.Admin.Client.PostAsJsonAsync($"/api/admin/offerings/{s.Cohort.OfferingId}/resources",
            new UpsertResourceRequest("Extra reading", null, false, 2));
        await created.EnsureStatusAsync(HttpStatusCode.Created);
        var extra = (await created.Content.ReadFromJsonAsync<AdminResourceDto>())!;
        Assert.Empty(extra.Files);
        var withFile = await UploadOkAsync(s.Admin, extra.Id, ("extra.pdf", PdfBytes));
        var extraFileId = Assert.Single(withFile.Files).Id;
        Assert.Equal(before + 1, StoredObjectCount());

        await (await s.Admin.Client.DeleteAsync($"/api/admin/offerings/resources/{extra.Id}")).EnsureStatusAsync(HttpStatusCode.NoContent);

        Assert.Equal(before, StoredObjectCount());
        Assert.False(await _factory.WithDbAsync(db => db.FileAssets.AnyAsync(f => f.Id == extraFileId)));
        Assert.True(await _factory.WithDbAsync(db => db.FileAssets.AnyAsync(f => f.Id == fileId)));
    }

    [Fact]
    public async Task Updating_a_material_keeps_its_files()
    {
        var s = await ArrangeAsync();
        await UploadOkAsync(s.Admin, s.Cohort.ResourceId, ("a.pdf", PdfBytes));

        var update = await s.Admin.Client.PutAsJsonAsync($"/api/admin/offerings/resources/{s.Cohort.ResourceId}",
            new UpsertResourceRequest("Syllabus v2", null, true, 1));
        await update.EnsureStatusAsync(HttpStatusCode.OK);

        var updated = (await update.Content.ReadFromJsonAsync<AdminResourceDto>())!;
        Assert.Equal("Syllabus v2", updated.Title);
        Assert.Null(updated.Url);
        Assert.Single(updated.Files);
    }
}
