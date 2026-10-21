namespace AndalusiaAcademy.API.ENUMs;

/// <summary>
/// The single source of truth for which role grants which permission.
/// Seeded into Role / Permission / RolePermission and embedded in issued access tokens.
/// </summary>
public static class RolePermissionMatrix
{
    public static readonly IReadOnlyDictionary<string, IReadOnlyList<string>> Grants =
        new Dictionary<string, IReadOnlyList<string>>
        {
            [AppRoles.Learner] =
            [
                PermissionCodes.ApplicationsApply,
                PermissionCodes.PaymentsPayOwn,
                PermissionCodes.LearningAccess,
                PermissionCodes.AssignmentsSubmit
            ],
            [AppRoles.Instructor] =
            [
                PermissionCodes.CohortsViewAssigned,
                PermissionCodes.AttendanceRecord,
                PermissionCodes.AssignmentsManage,
                PermissionCodes.SubmissionsGrade
            ],
            [AppRoles.Admin] =
            [
                PermissionCodes.UsersManage,
                PermissionCodes.CoursesManage,
                PermissionCodes.SchedulesManage,
                PermissionCodes.PaymentsManage,
                PermissionCodes.CohortsViewAssigned,
                PermissionCodes.AttendanceRecord,
                PermissionCodes.AssignmentsManage,
                PermissionCodes.SubmissionsGrade
            ],
            [AppRoles.ContentManager] =
            [
                PermissionCodes.ContentManage,
                PermissionCodes.CoursesManage
            ]
        };

    public static IReadOnlyList<string> PermissionsFor(IEnumerable<string> roles) =>
        roles.Where(Grants.ContainsKey)
            .SelectMany(r => Grants[r])
            .Distinct(StringComparer.Ordinal)
            .OrderBy(p => p, StringComparer.Ordinal)
            .ToList();
}
