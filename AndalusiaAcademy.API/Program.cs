using Microsoft.EntityFrameworkCore;
using AndalusiaAcademy.API.Common.DependencyInjection;
using AndalusiaAcademy.API.Common.Security;
using AndalusiaAcademy.API.Data;
using AndalusiaAcademy.API.Data.Seed;
using AndalusiaAcademy.API.Middleware;
using AndalusiaAcademy.API.Repositories.Interfaces;
using AndalusiaAcademy.API.Repositories.Implementations;
using AndalusiaAcademy.API.Services.Interfaces.Catalog;
using AndalusiaAcademy.API.Services.Implementations.Catalog;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddSingleton(TimeProvider.System);

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
builder.Services.AddScoped<ICatalogService, CachedCatalogService>();
builder.Services.AddScoped<IOfferingCatalogService, OfferingCatalogService>();
builder.Services.AddIdentityModule(builder.Configuration);
builder.Services.AddAdmissionsModule(builder.Configuration);
builder.Services.AddPaymentsModule(builder.Configuration);
builder.Services.AddLearningModule();
builder.Services.AddOperationsModule(builder.Configuration);

var app = builder.Build();

app.UseExceptionHandler();
app.UseStatusCodePages();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    using var scope = app.Services.CreateScope();
    await scope.ServiceProvider.GetRequiredService<DemoDataSeeder>().SeedAsync();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.UseRateLimiter();
app.MapControllers();

app.Run();

/// <summary>Exposed for WebApplicationFactory-based integration tests.</summary>
public partial class Program;
