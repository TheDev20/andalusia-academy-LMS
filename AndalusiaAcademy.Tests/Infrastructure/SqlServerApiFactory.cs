using System.Security.Cryptography;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using AndalusiaAcademy.API.Data;

namespace AndalusiaAcademy.Tests.Infrastructure;

/// <summary>
/// Boots the real API against a throw-away SQL Server database (migrations applied, dropped on dispose).
/// Requires the <c>ANDALUSIA_TEST_SQL_SERVER</c> environment variable: a SQL Server connection string
/// without a database name (CI provides one via a service container; locally use LocalDB or Docker).
/// </summary>
public sealed class SqlServerApiFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    public const string ServerEnvironmentVariable = "ANDALUSIA_TEST_SQL_SERVER";

    private readonly string _connectionString;
    private readonly string _signingKey = Convert.ToHexString(RandomNumberGenerator.GetBytes(32));

    /// <summary>Private upload directory for this run; removed on dispose.</summary>
    public string StorageRoot { get; } = Path.Combine(Path.GetTempPath(), "andalusia-tests-" + Guid.NewGuid().ToString("N"));

    /// <summary>Per-run Stripe webhook signing secret, so tests can sign their own events.</summary>
    public string StripeWebhookSecret { get; } = "whsec_test_" + Convert.ToHexString(RandomNumberGenerator.GetBytes(24));

    public SqlServerApiFactory()
    {
        var server = Environment.GetEnvironmentVariable(ServerEnvironmentVariable);
        if (string.IsNullOrWhiteSpace(server))
        {
            throw new InvalidOperationException(
                $"Integration tests need SQL Server. Set {ServerEnvironmentVariable} to a connection string without a database, " +
                "e.g. \"Server=localhost,1433;User Id=sa;Password=<secret>;TrustServerCertificate=True\" or " +
                "\"Server=(localdb)\\\\mssqllocaldb;Trusted_Connection=True;TrustServerCertificate=True\".");
        }

        _connectionString = new SqlConnectionStringBuilder(server)
        {
            InitialCatalog = $"AndalusiaTests_{Guid.NewGuid():N}",
            MultipleActiveResultSets = true
        }.ConnectionString;
    }

    /// <summary>Extra configuration applied on top of the defaults (e.g. to disable the payment simulation).</summary>
    public Dictionary<string, string?> Overrides { get; } = new();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.ConfigureAppConfiguration((_, config) =>
        {
            var settings = new Dictionary<string, string?>
            {
                ["ConnectionStrings:DefaultConnection"] = _connectionString,
                ["Jwt:SigningKey"] = _signingKey,
                ["Payments:SimulationEnabled"] = "true",
                ["Payments:StripeWebhookSecret"] = StripeWebhookSecret,
                ["Identity:ExposeResetTokenInResponse"] = "true",
                ["RateLimiting:Auth:PermitLimit"] = "100000",
                ["Seed:DemoData:Enabled"] = "false",
                ["Storage:RootPath"] = StorageRoot
            };
            foreach (var (key, value) in Overrides)
            {
                settings[key] = value;
            }

            config.AddInMemoryCollection(settings);
        });
    }

    public async Task InitializeAsync()
    {
        await using var scope = Services.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        await db.Database.MigrateAsync();
    }

    async Task IAsyncLifetime.DisposeAsync()
    {
        await using (var scope = Services.CreateAsyncScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            await db.Database.EnsureDeletedAsync();
        }

        await base.DisposeAsync();

        try
        {
            if (Directory.Exists(StorageRoot))
            {
                Directory.Delete(StorageRoot, recursive: true);
            }
        }
        catch (IOException)
        {
            // Temp files are cleaned by the OS eventually.
        }
    }

    public async Task WithDbAsync(Func<ApplicationDbContext, Task> action)
    {
        await using var scope = Services.CreateAsyncScope();
        await action(scope.ServiceProvider.GetRequiredService<ApplicationDbContext>());
    }

    public async Task<T> WithDbAsync<T>(Func<ApplicationDbContext, Task<T>> action)
    {
        await using var scope = Services.CreateAsyncScope();
        return await action(scope.ServiceProvider.GetRequiredService<ApplicationDbContext>());
    }
}

[CollectionDefinition(Name)]
public sealed class ApiCollection : ICollectionFixture<SqlServerApiFactory>
{
    public const string Name = "SQL Server API";
}
