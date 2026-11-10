using Microsoft.AspNetCore.Identity;
using AndalusiaAcademy.API.Data.Seed;
using AndalusiaAcademy.API.Models.Identity;
using AndalusiaAcademy.API.Services.Implementations.Admissions;
using AndalusiaAcademy.API.Services.Implementations.Identity;
using AndalusiaAcademy.API.Services.Implementations.Learning;
using AndalusiaAcademy.API.Services.Implementations.Notifications;
using AndalusiaAcademy.API.Services.Implementations.Operations;
using AndalusiaAcademy.API.Services.Implementations.Payments;
using AndalusiaAcademy.API.Services.Interfaces.Admissions;
using AndalusiaAcademy.API.Services.Interfaces.Identity;
using AndalusiaAcademy.API.Services.Interfaces.Learning;
using AndalusiaAcademy.API.Services.Interfaces.Operations;
using AndalusiaAcademy.API.Services.Interfaces.Payments;
using IdentityOptions = AndalusiaAcademy.API.Services.Implementations.Identity.IdentityOptions;

namespace AndalusiaAcademy.API.Common.DependencyInjection;

/// <summary>
/// Per-module service registration keeps Program.cs thin and module boundaries explicit (ADR 001).
/// </summary>
public static class ModuleRegistration
{
    public static IServiceCollection AddIdentityModule(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<IdentityOptions>(configuration.GetSection(IdentityOptions.SectionName));
        services.AddSingleton<IPasswordHasher<AppUser>, CompatiblePasswordHasher>();
        services.AddScoped<UserSessionFactory>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IProfileService, ProfileService>();
        services.AddScoped<IPasswordResetNotifier, OutboxPasswordResetNotifier>();
        return services;
    }

    public static IServiceCollection AddAdmissionsModule(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<AdmissionsOptions>(configuration.GetSection(AdmissionsOptions.SectionName));
        services.AddScoped<ICapacityService, CapacityService>();
        services.AddScoped<IApplicationService, ApplicationService>();
        services.AddScoped<IEnrollmentService, EnrollmentService>();
        return services;
    }

    public static IServiceCollection AddPaymentsModule(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<PaymentOptions>(configuration.GetSection(PaymentOptions.SectionName));
        services.AddSingleton<IPaymentGateway, SimulatedPaymentGateway>();
        services.AddScoped<IPaymentService, PaymentService>();
        services.AddScoped<IStripeWebhookService, StripeWebhookService>();
        return services;
    }

    public static IServiceCollection AddLearningModule(this IServiceCollection services)
    {
        services.AddScoped<ProgressQueries>();
        services.AddScoped<ILearnerLearningService, LearnerLearningService>();
        services.AddScoped<IInstructorService, InstructorService>();
        return services;
    }

    public static IServiceCollection AddOperationsModule(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IAdminUserService, AdminUserService>();
        services.AddScoped<IAdminCourseService, AdminCourseService>();
        services.AddScoped<IAdminOfferingService, AdminOfferingService>();
        services.AddScoped<IAdminScheduleService, AdminScheduleService>();
        services.AddScoped<IAdminPaymentService, AdminPaymentService>();

        services.Configure<DemoDataOptions>(configuration.GetSection(DemoDataOptions.SectionName));
        services.AddScoped<DemoDataSeeder>();
        return services;
    }
}
