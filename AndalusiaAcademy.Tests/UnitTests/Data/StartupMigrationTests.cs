using System.Net;
using System.Net.Sockets;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using AndalusiaAcademy.API.Data;

namespace AndalusiaAcademy.Tests.UnitTests.Data;

public class StartupMigrationTests
{
    private sealed class TransientFailure : Exception;

    private static bool IsTransient(Exception ex) => ex is TransientFailure;

    private static readonly StartupMigrationOptions Options = new() { MaxWaitSeconds = 100, RetryDelaySeconds = 5, MaxRetryDelaySeconds = 15 };

    /// <summary>A clock that only moves when the test's delay function says so.</summary>
    private sealed class ManualClock : TimeProvider
    {
        private long _ticks;
        public override long GetTimestamp() => _ticks;
        public override long TimestampFrequency => TimeSpan.TicksPerSecond;
        public void Advance(TimeSpan by) => _ticks += by.Ticks;
    }

    private sealed class RecordingLogger : ILogger
    {
        public List<(LogLevel Level, string Message)> Entries { get; } = [];
        public IDisposable? BeginScope<TState>(TState state) where TState : notnull => null;
        public bool IsEnabled(LogLevel logLevel) => true;

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter) =>
            Entries.Add((logLevel, formatter(state, exception)));
    }

    private static async Task<(List<TimeSpan> Delays, RecordingLogger Logger, Exception? Error, int Attempts)> RunAsync(
        Func<int, Task> migrate, StartupMigrationOptions? options = null, CancellationToken cancellationToken = default)
    {
        var clock = new ManualClock();
        var delays = new List<TimeSpan>();
        var logger = new RecordingLogger();
        var attempts = 0;
        Exception? error = null;

        try
        {
            await StartupMigration.RunAsync(
                _ => migrate(++attempts), options ?? Options, logger, IsTransient,
                (wait, _) =>
                {
                    delays.Add(wait);
                    clock.Advance(wait);
                    return Task.CompletedTask;
                },
                clock, cancellationToken);
        }
        catch (Exception ex)
        {
            error = ex;
        }

        return (delays, logger, error, attempts);
    }

    [Fact]
    public async Task Succeeds_without_waiting_when_the_database_is_ready()
    {
        var result = await RunAsync(_ => Task.CompletedTask);

        Assert.Null(result.Error);
        Assert.Equal(1, result.Attempts);
        Assert.Empty(result.Delays);
        Assert.Empty(result.Logger.Entries);
    }

    [Fact]
    public async Task Retries_transient_failures_with_growing_capped_delays_until_it_succeeds()
    {
        var result = await RunAsync(attempt => attempt < 6 ? Task.FromException(new TransientFailure()) : Task.CompletedTask);

        Assert.Null(result.Error);
        Assert.Equal(6, result.Attempts);
        Assert.Equal([5, 10, 15, 15, 15], result.Delays.Select(d => (int)d.TotalSeconds));
        Assert.Equal(5, result.Logger.Entries.Count(e => e.Level == LogLevel.Warning));
        Assert.Contains(result.Logger.Entries, e => e.Level == LogLevel.Information && e.Message.Contains("attempt 6"));
        Assert.DoesNotContain(result.Logger.Entries, e => e.Level >= LogLevel.Error);
    }

    [Fact]
    public async Task Does_not_retry_errors_that_will_not_clear_up()
    {
        var result = await RunAsync(_ => Task.FromException(new InvalidOperationException("There is already an object named 'X'.")));

        Assert.IsType<InvalidOperationException>(result.Error);
        Assert.Equal(1, result.Attempts);
        Assert.Empty(result.Delays);
        Assert.Single(result.Logger.Entries, e => e.Level == LogLevel.Critical);
    }

    [Fact]
    public async Task Gives_up_loudly_once_the_time_budget_is_spent()
    {
        var result = await RunAsync(_ => Task.FromException(new TransientFailure()));

        Assert.IsType<TransientFailure>(result.Error);
        Assert.InRange(result.Attempts, 2, 20);
        Assert.True(result.Delays.Sum(d => d.TotalSeconds) < Options.MaxWaitSeconds);
        var critical = Assert.Single(result.Logger.Entries, e => e.Level == LogLevel.Critical);
        Assert.Contains("will not start", critical.Message);
    }

    [Fact]
    public async Task A_zero_budget_means_a_single_attempt()
    {
        var result = await RunAsync(_ => Task.FromException(new TransientFailure()), new StartupMigrationOptions { MaxWaitSeconds = 0 });

        Assert.IsType<TransientFailure>(result.Error);
        Assert.Equal(1, result.Attempts);
        Assert.Empty(result.Delays);
    }

    [Fact]
    public async Task Cancellation_is_not_retried_or_reported_as_a_failure()
    {
        using var cts = new CancellationTokenSource();
        var result = await RunAsync(_ => Task.FromException(new OperationCanceledException(cts.Token)), cancellationToken: cts.Token);

        Assert.IsAssignableFrom<OperationCanceledException>(result.Error);
        Assert.Equal(1, result.Attempts);
        Assert.DoesNotContain(result.Logger.Entries, e => e.Level >= LogLevel.Error);
    }

    [Fact]
    public void Classifies_network_failures_and_timeouts_as_transient_even_when_wrapped()
    {
        Assert.True(StartupMigration.IsTransientDatabaseError(new TimeoutException()));
        Assert.True(StartupMigration.IsTransientDatabaseError(new InvalidOperationException("wrapped", new System.Net.Sockets.SocketException())));
        Assert.True(StartupMigration.IsTransientDatabaseError(new IOException("connection dropped")));
        Assert.True(StartupMigration.IsTransientDatabaseError(new InvalidOperationException("wrapped", new TimeoutException())));
        Assert.False(StartupMigration.IsTransientDatabaseError(new InvalidOperationException("bad script")));
        Assert.False(StartupMigration.IsTransientDatabaseError(new ArgumentException("bad input")));
    }

    [Fact]
    public async Task An_unreachable_sql_server_is_recognised_as_transient_and_retried_before_failing()
    {
        // Nothing listens on port 1, so the connection is refused immediately. This exercises the real SqlException
        // that SQL Server clients raise, not a stand-in.
        var connection = "Server=127.0.0.1,1;Database=Unreachable;User Id=sa;Password=x;Connect Timeout=1;TrustServerCertificate=True;Encrypt=False";
        await using var db = new ApplicationDbContext(new DbContextOptionsBuilder<ApplicationDbContext>().UseSqlServer(connection).Options);
        var attempts = 0;
        var logger = new RecordingLogger();

        var error = await Assert.ThrowsAnyAsync<Exception>(() => StartupMigration.RunAsync(
            ct =>
            {
                attempts++;
                return db.Database.MigrateAsync(ct);
            },
            new StartupMigrationOptions { MaxWaitSeconds = 4, RetryDelaySeconds = 1, MaxRetryDelaySeconds = 1 },
            logger));

        Assert.Contains(error, Flatten(error).OfType<SqlException>().Cast<Exception>().DefaultIfEmpty(error));
        Assert.True(attempts >= 2, $"Expected the connection failure to be retried, but only {attempts} attempt(s) were made.");
        Assert.Single(logger.Entries, e => e.Level == LogLevel.Critical);
    }

    [Fact]
    public async Task A_server_that_accepts_connections_but_is_not_ready_yet_is_retried()
    {
        // A SQL Server that is still starting accepts the TCP connection and then fails the pre-login handshake.
        // Reproduce that with a listener that accepts and immediately drops every connection.
        using var listener = new TcpListener(IPAddress.Loopback, 0);
        listener.Start();
        var port = ((IPEndPoint)listener.LocalEndpoint).Port;
        using var stop = new CancellationTokenSource();
        var acceptLoop = Task.Run(async () =>
        {
            while (!stop.IsCancellationRequested)
            {
                try
                {
                    using var client = await listener.AcceptTcpClientAsync(stop.Token);
                }
                catch (OperationCanceledException)
                {
                    return;
                }
            }
        });

        try
        {
            var connection = $"Server=127.0.0.1,{port};Database=NotReady;User Id=sa;Password=x;Connect Timeout=2;TrustServerCertificate=True;Encrypt=False";
            await using var db = new ApplicationDbContext(new DbContextOptionsBuilder<ApplicationDbContext>().UseSqlServer(connection).Options);
            var attempts = 0;

            await Assert.ThrowsAnyAsync<SqlException>(() => StartupMigration.RunAsync(
                ct =>
                {
                    attempts++;
                    return db.Database.MigrateAsync(ct);
                },
                new StartupMigrationOptions { MaxWaitSeconds = 4, RetryDelaySeconds = 1, MaxRetryDelaySeconds = 1 },
                new RecordingLogger()));

            Assert.True(attempts >= 2, $"Expected the failed handshake to be retried, but only {attempts} attempt(s) were made.");
        }
        finally
        {
            await stop.CancelAsync();
            listener.Stop();
            await acceptLoop;
        }
    }

    /// <summary>Builds a real <see cref="SqlException"/> with the given server error number (the type has no public constructor).</summary>
    private static SqlException SqlServerError(int number, string message)
    {
        const System.Reflection.BindingFlags all = System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Static | System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Public;
        // The constructor differs slightly between driver versions, so fill the arguments by parameter name.
        var constructor = typeof(SqlError).GetConstructors(all).OrderByDescending(c => c.GetParameters().Length).First();
        var arguments = constructor.GetParameters().Select(p => p.Name switch
        {
            "infoNumber" => number,
            "errorState" => (object)(byte)0,
            "errorClass" => (byte)20,
            "server" => "server",
            "errorMessage" => message,
            "procedure" => "",
            _ => p.ParameterType.IsValueType ? Activator.CreateInstance(p.ParameterType) : null
        }).ToArray();
        var error = (SqlError)constructor.Invoke(arguments);
        var errors = (SqlErrorCollection)Activator.CreateInstance(typeof(SqlErrorCollection), true)!;
        typeof(SqlErrorCollection).GetMethod("Add", all)!.Invoke(errors, [error]);
        return (SqlException)typeof(SqlException).GetMethod("CreateException", all, [typeof(SqlErrorCollection), typeof(string)])!
            .Invoke(null, [errors, "11.0.0"])!;
    }

    [Theory]
    [InlineData(40613, "Database 'db' on server 'x.database.windows.net' is not currently available. Please retry the connection later.")]
    [InlineData(40197, "The service has encountered an error processing your request. Please try again.")]
    [InlineData(40501, "The service is currently busy. Retry the request after 10 seconds.")]
    [InlineData(49918, "Cannot process request. Not enough resources to process request.")]
    [InlineData(10928, "Resource ID: 1. The request limit for the database has been reached.")]
    [InlineData(1205, "Transaction was deadlocked on lock resources with another process and has been chosen as the deadlock victim.")]
    public void Azure_sql_transient_errors_are_retried_even_when_ef_wraps_them(int number, string message)
    {
        // EF Core wraps these in an InvalidOperationException that says the failure is "likely transient".
        var wrapped = new InvalidOperationException(
            "An exception has been raised that is likely due to a transient failure. Consider enabling transient error resiliency by adding 'EnableRetryOnFailure' to the 'UseSqlServer' call.",
            SqlServerError(number, message));

        Assert.True(StartupMigration.IsTransientDatabaseError(wrapped));
        Assert.True(StartupMigration.IsTransientDatabaseError(SqlServerError(number, message)));
    }

    [Fact]
    public void A_wrong_password_or_a_broken_script_is_not_retried()
    {
        Assert.False(StartupMigration.IsTransientDatabaseError(SqlServerError(18456, "Login failed for user 'sa'.")));
        Assert.False(StartupMigration.IsTransientDatabaseError(SqlServerError(2714, "There is already an object named 'X' in the database.")));
        Assert.False(StartupMigration.IsTransientDatabaseError(SqlServerError(207, "Invalid column name 'Y'.")));
    }

    private static IEnumerable<Exception> Flatten(Exception ex)
    {
        for (var current = ex; current is not null; current = current.InnerException)
        {
            yield return current;
        }
    }
}
