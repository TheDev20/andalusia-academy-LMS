using System.Net;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using AndalusiaAcademy.API.DTOs.Catalog;
using AndalusiaAcademy.API.DTOs.Common;
using AndalusiaAcademy.API.DTOs.Operations;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.API.Models.Catalog;
using AndalusiaAcademy.Tests.Infrastructure;
using CatalogProgram = AndalusiaAcademy.API.Models.Catalog.Program;

namespace AndalusiaAcademy.Tests.IntegrationTests.ApiContracts;

/// <summary>
/// Sprint 2 catalog contracts: course/program/career-path discovery and cache coherence after admin edits.
/// </summary>
[Collection(ApiCollection.Name)]
public class CatalogTests
{
    private readonly SqlServerApiFactory _factory;
    private readonly TestScenario _scenario;

    public CatalogTests(SqlServerApiFactory factory)
    {
        _factory = factory;
        _scenario = new TestScenario(factory);
    }

    [Fact]
    public async Task Course_details_and_search_are_public()
    {
        var admin = await _scenario.CreateUserAsync(AppRoles.Admin);
        var cohort = await _scenario.CreateCohortAsync(admin);
        var visitor = _scenario.Anonymous();

        var detail = await visitor.GetFromJsonAsync<CourseDetailDto>($"/api/catalog/courses/{cohort.CourseSlug}");
        Assert.Equal(cohort.CourseId, detail!.Id);
        Assert.Contains(detail.Offerings, o => o.Id == cohort.OfferingId);

        var search = await visitor.GetFromJsonAsync<PagedResult<CourseSummaryDto>>(
            $"/api/catalog/courses?searchTerm={Uri.EscapeDataString(cohort.CourseSlug)}");
        Assert.NotNull(search);

        await (await visitor.GetAsync($"/api/catalog/courses/missing-{Guid.NewGuid():N}")).EnsureStatusAsync(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Admin_course_edits_are_visible_immediately_despite_caching()
    {
        var admin = await _scenario.CreateUserAsync(AppRoles.Admin);
        var cohort = await _scenario.CreateCohortAsync(admin);
        var visitor = _scenario.Anonymous();

        var before = await visitor.GetFromJsonAsync<CourseDetailDto>($"/api/catalog/courses/{cohort.CourseSlug}");
        Assert.Equal("Integration Testing 101", before!.Title);

        var update = await admin.Client.PutAsJsonAsync($"/api/admin/courses/{cohort.CourseId}",
            new UpsertCourseRequest("Integration Testing 201", cohort.CourseSlug, "Updated.", PublicationStatuses.Published));
        await update.EnsureStatusAsync(HttpStatusCode.OK);

        var after = await visitor.GetFromJsonAsync<CourseDetailDto>($"/api/catalog/courses/{cohort.CourseSlug}");
        Assert.Equal("Integration Testing 201", after!.Title);
    }

    [Fact]
    public async Task Program_details_list_included_courses_and_career_paths_link_both()
    {
        var admin = await _scenario.CreateUserAsync(AppRoles.Admin);
        var cohort = await _scenario.CreateCohortAsync(admin);
        var programSlug = $"program-{Guid.NewGuid():N}";
        var pathSlug = $"path-{Guid.NewGuid():N}";

        await _factory.WithDbAsync(async db =>
        {
            var program = new CatalogProgram { Title = "Test Program", Slug = programSlug, Description = "Program", PublicationStatus = PublicationStatuses.Published };
            db.Programs.Add(program);
            db.ProgramCourses.Add(new ProgramCourse { ProgramId = program.Id, CourseId = cohort.CourseId, Sequence = 1, IsRequired = true });
            var path = new CareerPath { Title = "Test Path", Slug = pathSlug, Description = "Path" };
            db.CareerPaths.Add(path);
            db.CareerPathPrograms.Add(new CareerPathProgram { CareerPathId = path.Id, ProgramId = program.Id, Sequence = 1 });
            db.CareerPathCourses.Add(new CareerPathCourse { CareerPathId = path.Id, CourseId = cohort.CourseId, Sequence = 1 });
            await db.SaveChangesAsync();
        });

        var visitor = _scenario.Anonymous();
        var program = await visitor.GetFromJsonAsync<ProgramDetailDto>($"/api/catalog/programs/{programSlug}");
        Assert.Equal(cohort.CourseId, Assert.Single(program!.IncludedCourses).CourseId);

        var path = await visitor.GetFromJsonAsync<CareerPathDetailDto>($"/api/catalog/career-paths/{pathSlug}");
        Assert.Contains(path!.RecommendedPrograms, p => p.Slug == programSlug);
        Assert.Contains(path.RecommendedCourses, c => c.Id == cohort.CourseId);

        var paths = await visitor.GetFromJsonAsync<List<CareerPathSummaryDto>>("/api/catalog/career-paths");
        Assert.Contains(paths!, p => p.Slug == pathSlug);
    }

    [Fact]
    public async Task Discipline_writes_require_course_management_permission()
    {
        var request = new CreateTechDisciplineRequest { Title = $"Discipline {Guid.NewGuid():N}"[..30], Description = "A discipline for tests.", Icon = "Code2" };

        await (await _scenario.Anonymous().PostAsJsonAsync("/api/catalog/disciplines", request)).EnsureStatusAsync(HttpStatusCode.Unauthorized);

        var learner = await _scenario.RegisterLearnerAsync();
        await (await learner.Client.PostAsJsonAsync("/api/catalog/disciplines", request)).EnsureStatusAsync(HttpStatusCode.Forbidden);

        var contentManager = await _scenario.CreateUserAsync(AppRoles.ContentManager);
        await (await contentManager.Client.PostAsJsonAsync("/api/catalog/disciplines", request)).EnsureStatusAsync(HttpStatusCode.Created);

        await (await _scenario.Anonymous().GetAsync("/api/catalog/disciplines")).EnsureStatusAsync(HttpStatusCode.OK);
    }
}
