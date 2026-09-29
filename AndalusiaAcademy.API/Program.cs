using Microsoft.EntityFrameworkCore;
using AndalusiaAcademy.API.Data;
using AndalusiaAcademy.API.Repositories.Interfaces;
using AndalusiaAcademy.API.Repositories.Implementations;
using AndalusiaAcademy.API.Services.Interfaces.Catalog;
using AndalusiaAcademy.API.Services.Implementations.Catalog;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Caching Layer (Level 3 - In-Memory Cache)
builder.Services.AddMemoryCache();

// Database Context
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Server=(localdb)\\mssqllocaldb;Database=AndalusiaAcademyDev;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True";

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

// Repositories & Domain Services
builder.Services.AddScoped<ICourseRepository, CourseRepository>();
builder.Services.AddScoped<ICatalogService, CachedCatalogService>();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
