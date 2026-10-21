using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using AndalusiaAcademy.API.Exceptions;

namespace AndalusiaAcademy.API.Middleware;

/// <summary>
/// Maps exceptions to RFC 7807 problem details. Unexpected errors never leak internals to clients.
/// </summary>
public sealed class GlobalExceptionHandler : IExceptionHandler
{
    private const int SqlUniqueConstraintViolation = 2627;
    private const int SqlUniqueIndexViolation = 2601;

    private readonly IProblemDetailsService _problemDetails;
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(IProblemDetailsService problemDetails, ILogger<GlobalExceptionHandler> logger)
    {
        _problemDetails = problemDetails;
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        var (status, title, detail) = exception switch
        {
            AppException app => (app.StatusCode, app.Title, app.Message),
            DbUpdateConcurrencyException => (StatusCodes.Status409Conflict, "Conflict",
                "The record was modified by another request. Reload and try again."),
            DbUpdateException { InnerException: SqlException { Number: SqlUniqueConstraintViolation or SqlUniqueIndexViolation } } =>
                (StatusCodes.Status409Conflict, "Conflict", "A record with the same unique values already exists."),
            OperationCanceledException when httpContext.RequestAborted.IsCancellationRequested =>
                (499, "Client closed request", "The request was cancelled."),
            _ => (StatusCodes.Status500InternalServerError, "Unexpected error", "An unexpected error occurred.")
        };

        if (status >= StatusCodes.Status500InternalServerError)
        {
            _logger.LogError(exception, "Unhandled exception for {Method} {Path}", httpContext.Request.Method, httpContext.Request.Path);
        }
        else
        {
            _logger.LogInformation("Request {Method} {Path} failed with {StatusCode}: {Detail}",
                httpContext.Request.Method, httpContext.Request.Path, status, detail);
        }

        httpContext.Response.StatusCode = status;
        return await _problemDetails.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = httpContext,
            Exception = exception,
            ProblemDetails = new ProblemDetails { Status = status, Title = title, Detail = detail }
        });
    }
}
