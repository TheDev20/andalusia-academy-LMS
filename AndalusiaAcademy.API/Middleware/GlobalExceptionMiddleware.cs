using Microsoft.AspNetCore.Mvc;
using AndalusiaAcademy.API.Exceptions;

namespace AndalusiaAcademy.API.Middleware;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (NotFoundException ex)
        {
            await WriteProblemDetails(context, StatusCodes.Status404NotFound, "Resource Not Found", ex.Message);
        }
        catch (ConflictException ex)
        {
            await WriteProblemDetails(context, StatusCodes.Status409Conflict, "Conflict", ex.Message);
        }
        catch (ForbiddenException ex)
        {
            await WriteProblemDetails(context, StatusCodes.Status403Forbidden, "Forbidden", ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled server exception occurred: {Message}", ex.Message);
            await WriteProblemDetails(
                context,
                StatusCodes.Status500InternalServerError,
                "Internal Server Error",
                "An unexpected error occurred. Please contact support."
            );
        }
    }

    private static async Task WriteProblemDetails(HttpContext ctx, int status, string title, string detail)
    {
        ctx.Response.StatusCode = status;
        ctx.Response.ContentType = "application/problem+json";

        var problem = new ProblemDetails
        {
            Status = status,
            Title = title,
            Detail = detail,
            Instance = ctx.Request.Path
        };
        problem.Extensions["traceId"] = ctx.TraceIdentifier;

        await ctx.Response.WriteAsJsonAsync(problem);
    }
}
