namespace AndalusiaAcademy.API.ENUMs;

/// <summary>
/// Canonical role names persisted in the Role table and emitted as JWT role claims.
/// </summary>
public static class AppRoles
{
    public const string Learner = "Learner";
    public const string Instructor = "Instructor";
    public const string Admin = "Admin";
    public const string ContentManager = "ContentManager";

    public static readonly IReadOnlyList<string> All = [Learner, Instructor, Admin, ContentManager];
}
