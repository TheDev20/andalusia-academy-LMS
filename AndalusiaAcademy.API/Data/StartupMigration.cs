using System.Net.Sockets;
using Microsoft.Data.SqlClient;

namespace AndalusiaAcademy.API.Data;

/// <summary>Bound from the "Database:StartupMigration" configuration section.</summary>
public sealed class StartupMigrationOptions
{
    public const string SectionName = "Database:StartupMigration";

    /// <summary>
    /// Total time allowed for the migration, retries included. Covers an auto-paused Azure SQL database waking up;
    /// keep it below the host's startup timeout (120 s on App Service) so the failure is reported by the app itself.
    /// 0 disables retries.
    /// </summary>
    public int MaxWaitSeconds { get; init; } = 100;

    /// <summary>Delay before the second attempt; it grows linearly with each further attempt.</summary>
    public int RetryDelaySeconds { get; init; } = 5;

    /// <summary>Upper bound for a single delay between attempts.</summary>
    public int MaxRetryDelaySeconds { get; init; } = 15;
}

/// <summary>
/// Applies pending EF Core migrations at startup. Transient database errors (database waking up, brief network
/// loss) are retried within a time budget; anything else, or running out of budget, is logged as critical and
/// rethrown so the application does not start serving requests against a schema that is behind the code.
/// </summary>
public static class StartupMigration
{
    // Connection-level SQL Server errors that SqlException.IsTransient does not cover: unreachable or refused
    // server, timeouts, a database that is not open yet, and 0, which the driver uses for failures while
    // establishing the connection (including a pre-login handshake against a server that is still starting).
    private static readonly HashSet<int> ConnectionErrorNumbers = [0, -2, -1, 2, 53, 64, 233, 258, 4060, 10053, 10054, 10060, 10061, 11001];

    public static async Task RunAsync(
        Func<CancellationToken, Task> migrate,
        StartupMigrationOptions options,
        ILogger logger,
        Func<Exception, bool>? isTransient = null,
        Func<TimeSpan, CancellationToken, Task>? delay = null,
        TimeProvider? clock = null,
        CancellationToken cancellationToken = default)
    {
        isTransient ??= IsTransientDatabaseError;
        delay ??= Task.Delay;
        clock ??= TimeProvider.System;

        var budget = TimeSpan.FromSeconds(Math.Max(0, options.MaxWaitSeconds));
        var started = clock.GetTimestamp();

        for (var attempt = 1; ; attempt++)
        {
            try
            {
                await migrate(cancellationToken);
                if (attempt > 1)
                {
                    logger.LogInformation("Database migration succeeded on attempt {Attempt}.", attempt);
                }

                return;
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                var elapsed = clock.GetElapsedTime(started);
                var wait = TimeSpan.FromSeconds(Math.Min(
                    Math.Max(0, options.RetryDelaySeconds) * attempt,
                    Math.Max(0, options.MaxRetryDelaySeconds)));

                if (!isTransient(ex) || elapsed + wait >= budget)
                {
                    logger.LogCritical(ex,
                        "Database migration failed after {Attempts} attempt(s) over {ElapsedSeconds:F0}s; the application will not start with an out-of-date schema.",
                        attempt, elapsed.TotalSeconds);
                    throw;
                }

                logger.LogWarning(ex,
                    "Database migration attempt {Attempt} failed with a transient error; retrying in {DelaySeconds:F0}s.",
                    attempt, wait.TotalSeconds);
                await delay(wait, cancellationToken);
            }
        }
    }

    /// <summary>True for errors that usually clear up on their own: network failures, timeouts, a paused database.</summary>
    public static bool IsTransientDatabaseError(Exception exception)
    {
        for (var current = exception; current is not null; current = current.InnerException)
        {
            switch (current)
            {
                case SqlException sql when sql.IsTransient || ConnectionErrorNumbers.Contains(sql.Number):
                // A refused or dropped connection can also surface with the socket or IO error as the root cause.
                // A refused or dropped connection can also surface with the socket or IO error as the root cause.
                case SocketException:
                case IOException:
                case TimeoutException:
                    return true;
            }
        }

        return false;
    }
}
