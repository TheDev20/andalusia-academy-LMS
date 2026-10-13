using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using AndalusiaAcademy.API.Services.Interfaces.Identity;
using AndalusiaAcademy.API.Services.Implementations.Identity;
using System.Reflection;
using Microsoft.AspNetCore.Mvc;
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
        Description = "RESTful API for Andalusia Academy Catalog, Courses & Programs"
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

// Caching Layer
builder.Services.AddMemoryCache();

// Database Context
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// Repositories & Domain Services
builder.Services.AddScoped<ICourseRepository, CourseRepository>();
builder.Services.AddScoped<IProgramRepository, ProgramRepository>();
builder.Services.AddScoped<ICareerPathRepository, CareerPathRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICatalogService, CachedCatalogService>();

var jwtConfig = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtConfig["Key"]!);
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = jwtConfig["Issuer"],
        ValidateAudience = true,
        ValidAudience = jwtConfig["Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});
// Identity Services
builder.Services.AddScoped<IPasswordHasherService, PasswordHasherService>();
builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
builder.Services.AddScoped<IAuthService, AuthService>();
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
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Seed initial catalog data in Development if database is empty
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await AndalusiaAcademy.API.Data.Seed.CatalogDbSeeder.SeedCatalogAsync(dbContext);
}

app.Run();
