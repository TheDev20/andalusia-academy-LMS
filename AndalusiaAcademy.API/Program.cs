using System.Reflection;
using Microsoft.OpenApi;
using Microsoft.EntityFrameworkCore;
using AndalusiaAcademy.API.Data;
using AndalusiaAcademy.API.Repositories.Interfaces;
using AndalusiaAcademy.API.Repositories.Implementations;
using AndalusiaAcademy.API.Services.Interfaces.Catalog;
using AndalusiaAcademy.API.Services.Implementations.Catalog;
using FluentValidation;
using FluentValidation.AspNetCore;
using AndalusiaAcademy.API.Validator;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<CreateTechDisciplineValidator>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Andalusia Academy LMS API",
        Version = "v1",
        Description = "RESTful API for Andalusia Academy Catalog, Courses & Programs"
    });
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    c.IncludeXmlComments(xmlPath);
});

// CORS configuration for React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "http://localhost:3000",
                "http://127.0.0.1:3000")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Caching Layer (Level 3 - In-Memory Cache)
builder.Services.AddMemoryCache();

// Database Context
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// Repositories & Domain Services (SOLID - Dependency Inversion)
builder.Services.AddScoped<ICourseRepository, CourseRepository>();
builder.Services.AddScoped<IProgramRepository, ProgramRepository>();
builder.Services.AddScoped<ICareerPathRepository, CareerPathRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ICatalogService, CachedCatalogService>();

var app = builder.Build();

app.UseMiddleware<AndalusiaAcademy.API.Middleware.GlobalExceptionMiddleware>();
app.UseCors("AllowFrontend");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint(
            "/swagger/v1/swagger.json",
            "Andalusia Academy LMS API v1");
    });
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// Seed initial catalog data in Development if database is empty
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await AndalusiaAcademy.API.Data.Seed.CatalogDbSeeder.SeedCatalogAsync(dbContext);
}

app.Run();
