namespace AndalusiaAcademy.API.Common.Security;

/// <summary>
/// Authenticated caller resolved from the validated access token.
/// </summary>
public interface ICurrentUser
{
    Guid UserId { get; }
    bool IsInRole(string role);
}

public sealed class HttpContextCurrentUser : ICurrentUser
{
    private readonly IHttpContextAccessor _accessor;

    public HttpContextCurrentUser(IHttpContextAccessor accessor)
    {
        _accessor = accessor;
    }

    public Guid UserId
    {
        get
        {
            var raw = _accessor.HttpContext?.User.FindFirst(AppClaimTypes.UserId)?.Value;
            return Guid.TryParse(raw, out var id)
                ? id
                : throw new InvalidOperationException("No authenticated user is associated with the current request.");
        }
    }

    public bool IsInRole(string role) => _accessor.HttpContext?.User.IsInRole(role) ?? false;
}
