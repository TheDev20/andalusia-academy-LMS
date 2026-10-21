using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.API.Models.Catalog;
using AndalusiaAcademy.API.Models.Identity;
using AndalusiaAcademy.API.Models.Learning;

namespace AndalusiaAcademy.API.Data.Seed;

/// <summary>Bound from "Seed:DemoData". Never enable outside local/demo environments.</summary>
public sealed class DemoDataOptions
{
    public const string SectionName = "Seed:DemoData";

    public bool Enabled { get; init; }

    /// <summary>Password for the demo accounts; supplied via user-secrets, never committed.</summary>
    public string? Password { get; init; }
}

/// <summary>
/// Idempotent sprint-demo data: one account per role plus a published course offering with an
/// assigned instructor, sessions, a location, materials and an assignment.
/// </summary>
public sealed class DemoDataSeeder
{
    public const string AdminEmail = "admin@demo.andalusia.local";
    public const string InstructorEmail = "instructor@demo.andalusia.local";
    public const string LearnerEmail = "learner@demo.andalusia.local";
    public const string ContentManagerEmail = "content@demo.andalusia.local";
    private const string CourseSlug = "full-stack-dotnet-react";

    private readonly ApplicationDbContext _context;
    private readonly IPasswordHasher<AppUser> _hasher;
    private readonly DemoDataOptions _options;
    private readonly TimeProvider _clock;
    private readonly ILogger<DemoDataSeeder> _logger;

    public DemoDataSeeder(
        ApplicationDbContext context,
        IPasswordHasher<AppUser> hasher,
        IOptions<DemoDataOptions> options,
        TimeProvider clock,
        ILogger<DemoDataSeeder> logger)
    {
        _context = context;
        _hasher = hasher;
        _options = options.Value;
        _clock = clock;
        _logger = logger;
    }

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        if (!_options.Enabled)
        {
            return;
        }

        if (string.IsNullOrWhiteSpace(_options.Password) || _options.Password.Length < 8)
        {
            _logger.LogWarning("Demo data seeding skipped: set Seed:DemoData:Password (min 8 chars) via user-secrets.");
            return;
        }

        if (await _context.AppUsers.AnyAsync(u => u.Email == AdminEmail, cancellationToken))
        {
            return;
        }

        var admin = CreateUser("Amira", "Admin", AdminEmail, AppRoles.Admin);
        var instructor = CreateUser("Ibrahim", "Instructor", InstructorEmail, AppRoles.Instructor);
        instructor.InstructorProfile = new InstructorProfile { UserId = instructor.Id, Biography = "Senior .NET engineer and trainer." };
        var learner = CreateUser("Layla", "Learner", LearnerEmail, AppRoles.Learner);
        var contentManager = CreateUser("Cairo", "Content", ContentManagerEmail, AppRoles.ContentManager);
        _context.AppUsers.AddRange(admin, instructor, learner, contentManager);

        if (!await _context.Courses.AnyAsync(c => c.Slug == CourseSlug, cancellationToken))
        {
            SeedCourse(instructor.Id);
        }

        await _context.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("Demo data seeded (admin, instructor, learner, content manager and one course offering).");
    }

    private AppUser CreateUser(string first, string last, string email, string role)
    {
        var user = new AppUser { FirstName = first, LastName = last, Email = email, CreatedAt = _clock.GetUtcNow() };
        user.PasswordHash = _hasher.HashPassword(user, _options.Password!);
        user.UserRoles.Add(new UserRole { UserId = user.Id, RoleId = IdentitySeedData.RoleIdFor(role) });
        return user;
    }

    private void SeedCourse(Guid instructorId)
    {
        var now = _clock.GetUtcNow();
        var category = new Category { Name = "Software Engineering", Slug = "software-engineering-demo" };
        var course = new Course
        {
            Title = "Full-Stack Development with .NET & React",
            Slug = CourseSlug,
            Description = "Build production-grade web applications with ASP.NET Core, EF Core, SQL Server and React.",
            PublicationStatus = PublicationStatuses.Published
        };
        course.CourseCategories.Add(new CourseCategory { CourseId = course.Id, Category = category, CategoryId = category.Id, Sequence = 1 });

        var offering = new Offering
        {
            Kind = OfferingKinds.Course,
            Course = course,
            CourseId = course.Id,
            StartsAt = now.AddDays(14),
            EndsAt = now.AddDays(74),
            TimeZoneId = "Africa/Cairo",
            Price = 4500m,
            Currency = "EGP",
            Capacity = 25,
            Status = OfferingStatuses.Published
        };

        var location = new Location { Name = "Andalusia Academy - Smart Village Campus", Address = "Smart Village, Giza, Egypt" };

        _context.Courses.Add(course);
        _context.Offerings.Add(offering);
        _context.Locations.Add(location);
        _context.OfferingInstructors.Add(new OfferingInstructor { OfferingId = offering.Id, InstructorId = instructorId });

        for (var week = 0; week < 4; week++)
        {
            var start = offering.StartsAt.AddDays(week * 7);
            _context.Sessions.Add(new Session
            {
                CourseOfferingId = offering.Id,
                CourseKind = OfferingKinds.Course,
                Location = location,
                LocationId = location.Id,
                Title = $"Week {week + 1} workshop",
                StartsAt = start,
                EndsAt = start.AddHours(3),
                Status = SessionStatuses.Scheduled
            });
        }

        _context.Resources.AddRange(
            new Resource { CourseOfferingId = offering.Id, CourseKind = OfferingKinds.Course, Title = "Course handbook", Url = "https://learn.microsoft.com/aspnet/core/", Required = true, Sequence = 1 },
            new Resource { CourseOfferingId = offering.Id, CourseKind = OfferingKinds.Course, Title = "React fundamentals", Url = "https://react.dev/learn", Required = true, Sequence = 2 },
            new Resource { CourseOfferingId = offering.Id, CourseKind = OfferingKinds.Course, Title = "Optional reading: EF Core performance", Url = "https://learn.microsoft.com/ef/core/performance/", Required = false, Sequence = 3 });

        _context.Assignments.Add(new Assignment
        {
            CourseOfferingId = offering.Id,
            CourseKind = OfferingKinds.Course,
            Title = "Build a REST API",
            Instructions = "Implement a CRUD API for a resource of your choice with validation and tests.",
            MaxScore = 100m,
            DueAt = offering.StartsAt.AddDays(21),
            Status = AssignmentStatuses.Published
        });
    }
}
