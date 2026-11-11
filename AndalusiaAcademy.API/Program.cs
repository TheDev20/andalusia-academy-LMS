using System.Reflection;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;
using AndalusiaAcademy.API.Common.DependencyInjection;
using AndalusiaAcademy.API.Common.Security;
using AndalusiaAcademy.API.Data;
using AndalusiaAcademy.API.Data.Seed;
using AndalusiaAcademy.API.Middleware;
using AndalusiaAcademy.API.Repositories.Interfaces;
using AndalusiaAcademy.API.Repositories.Implementations;
using AndalusiaAcademy.API.Services.Interfaces.Catalog;
using AndalusiaAcademy.API.Services.Implementations.Catalog;
using AndalusiaAcademy.API.Validator;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .ConfigureApiBehaviorOptions(options =>
    {
        options.InvalidModelStateResponseFactory = context =>
        {
            var errors = context.ModelState
                .Where(e => e.Value?.Errors.Count > 0)
                .ToDictionary(
                    k => k.Key,
                    v => v.Value!.Errors.Select(e => e.ErrorMessage).ToArray()
                );

            var problem = new ValidationProblemDetails(errors)
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "One or more validation errors occurred.",
                Instance = context.HttpContext.Request.Path
            };
            problem.Extensions["traceId"] = context.HttpContext.TraceIdentifier;

            return new BadRequestObjectResult(problem)
            {
                ContentTypes = { "application/problem+json" }
            };
        };
    });
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<CreateTechDisciplineValidator>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Andalusia Academy LMS API",
        Version = "v1",
        Description = "RESTful API for Andalusia Academy: catalog, identity, admissions, payments, learning and operations"
    });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(document => new OpenApiSecurityRequirement
    {
        [new OpenApiSecuritySchemeReference("Bearer", document)] = new List<string>()
    });
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    c.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFile));
});
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddSingleton(TimeProvider.System);

// CORS for the React frontend; origins come from configuration (Cors:AllowedOrigins) per environment.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        var origins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
        policy.WithOrigins(origins).AllowAnyHeader().AllowAnyMethod();
    });
});

// Caching Layer (Level 3 - In-Memory Cache)
builder.Services.AddMemoryCache();

// Database Context (resolved lazily so host-level configuration overrides apply)
const string FallbackConnectionString =
    "Server=(localdb)\\mssqllocaldb;Database=AndalusiaAcademyDev;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True";

builder.Services.AddDbContext<ApplicationDbContext>((serviceProvider, options) =>
    options.UseSqlServer(
        serviceProvider.GetRequiredService<IConfiguration>().GetConnectionString("DefaultConnection") ?? FallbackConnectionString));

// Authentication, Authorization & Abuse Protection
builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddAuthRateLimiting();

// Repositories & Domain Services
builder.Services.AddScoped<ICourseRepository, CourseRepository>();
builder.Services.AddScoped<IProgramRepository, ProgramRepository>();
builder.Services.AddScoped<ICareerPathRepository, CareerPathRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddSingleton<CatalogCacheInvalidator>();
builder.Services.AddScoped<ICatalogService, CachedCatalogService>();
builder.Services.AddScoped<IOfferingCatalogService, OfferingCatalogService>();
builder.Services.AddIdentityModule(builder.Configuration);
builder.Services.AddAdmissionsModule(builder.Configuration);
builder.Services.AddPaymentsModule(builder.Configuration);
builder.Services.AddStorageModule(builder.Configuration);
builder.Services.AddLearningModule();
builder.Services.AddOperationsModule(builder.Configuration);

var app = builder.Build();

app.UseExceptionHandler();
app.UseStatusCodePages();
app.UseCors("AllowFrontend");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Andalusia Academy LMS API v1"));
}

if (!app.Environment.IsEnvironment("Testing"))
{
    try
    {
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        await db.Database.MigrateAsync();
        await CatalogDbSeeder.SeedCatalogAsync(db);
        await scope.ServiceProvider.GetRequiredService<DemoDataSeeder>().SeedAsync();
    }
    catch (Exception ex)
    {
        app.Logger.LogWarning(ex, "Database migration or seeding skipped on startup.");
    }
}

app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseAuthentication();
app.UseAuthorization();
app.UseRateLimiter();
app.MapControllers();

var webRootPath = app.Environment.WebRootPath ?? Path.Combine(app.Environment.ContentRootPath, "wwwroot");
if (File.Exists(Path.Combine(webRootPath, "index.html")))
{
    app.MapFallbackToFile("index.html");
}

app.Run();

/// <summary>Exposed for WebApplicationFactory-based integration tests.</summary>
public partial class Program;
