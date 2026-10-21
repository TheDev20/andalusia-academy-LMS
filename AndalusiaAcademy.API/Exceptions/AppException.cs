namespace AndalusiaAcademy.API.Exceptions;

/// <summary>
/// Base type for expected, client-facing failures. Translated to RFC 7807 problem details
/// by <c>GlobalExceptionHandler</c>; the message is safe to return to callers.
/// </summary>
public abstract class AppException : Exception
{
    protected AppException(string message) : base(message) { }

    public abstract int StatusCode { get; }
    public abstract string Title { get; }
}

public sealed class NotFoundException : AppException
{
    public NotFoundException(string message) : base(message) { }
    public override int StatusCode => StatusCodes.Status404NotFound;
    public override string Title => "Resource not found";
}

public class ConflictException : AppException
{
    public ConflictException(string message) : base(message) { }
    public override int StatusCode => StatusCodes.Status409Conflict;
    public override string Title => "Conflict";
}

public sealed class ForbiddenException : AppException
{
    public ForbiddenException(string message) : base(message) { }
    public override int StatusCode => StatusCodes.Status403Forbidden;
    public override string Title => "Forbidden";
}

public sealed class UnauthorizedException : AppException
{
    public UnauthorizedException(string message) : base(message) { }
    public override int StatusCode => StatusCodes.Status401Unauthorized;
    public override string Title => "Unauthorized";
}

/// <summary>Request is well-formed but violates a business rule.</summary>
public sealed class BusinessRuleException : AppException
{
    public BusinessRuleException(string message) : base(message) { }
    public override int StatusCode => StatusCodes.Status422UnprocessableEntity;
    public override string Title => "Business rule violation";
}

public sealed class ServiceUnavailableException : AppException
{
    public ServiceUnavailableException(string message) : base(message) { }
    public override int StatusCode => StatusCodes.Status503ServiceUnavailable;
    public override string Title => "Service unavailable";
}
