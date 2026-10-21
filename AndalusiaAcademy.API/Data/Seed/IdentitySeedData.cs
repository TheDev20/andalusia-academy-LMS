using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.API.Models.Identity;

namespace AndalusiaAcademy.API.Data.Seed;

/// <summary>
/// Reference data seeded through migrations (HasData). Identifiers are fixed so migrations stay deterministic;
/// never change an existing id — add new rows instead.
/// </summary>
public static class IdentitySeedData
{
    public static readonly Guid LearnerRoleId = Guid.Parse("8f1c0d5e-3a7b-4c1d-9a01-000000000001");
    public static readonly Guid InstructorRoleId = Guid.Parse("8f1c0d5e-3a7b-4c1d-9a01-000000000002");
    public static readonly Guid AdminRoleId = Guid.Parse("8f1c0d5e-3a7b-4c1d-9a01-000000000003");
    public static readonly Guid ContentManagerRoleId = Guid.Parse("8f1c0d5e-3a7b-4c1d-9a01-000000000004");

    private static readonly Dictionary<string, Guid> RoleIds = new()
    {
        [AppRoles.Learner] = LearnerRoleId,
        [AppRoles.Instructor] = InstructorRoleId,
        [AppRoles.Admin] = AdminRoleId,
        [AppRoles.ContentManager] = ContentManagerRoleId
    };

    private static readonly Dictionary<string, (Guid Id, string Description)> PermissionRows = new()
    {
        [PermissionCodes.ApplicationsApply] = (Guid.Parse("5b7e2a10-6c4d-4e8f-8b02-000000000001"), "Submit and manage own applications"),
        [PermissionCodes.PaymentsPayOwn] = (Guid.Parse("5b7e2a10-6c4d-4e8f-8b02-000000000002"), "Check out and pay own orders"),
        [PermissionCodes.LearningAccess] = (Guid.Parse("5b7e2a10-6c4d-4e8f-8b02-000000000003"), "Access enrolled course learning pages"),
        [PermissionCodes.AssignmentsSubmit] = (Guid.Parse("5b7e2a10-6c4d-4e8f-8b02-000000000004"), "Submit assignments"),
        [PermissionCodes.CohortsViewAssigned] = (Guid.Parse("5b7e2a10-6c4d-4e8f-8b02-000000000005"), "View assigned cohorts and learner progress"),
        [PermissionCodes.AttendanceRecord] = (Guid.Parse("5b7e2a10-6c4d-4e8f-8b02-000000000006"), "Record and correct session attendance"),
        [PermissionCodes.AssignmentsManage] = (Guid.Parse("5b7e2a10-6c4d-4e8f-8b02-000000000007"), "Create and edit assignments"),
        [PermissionCodes.SubmissionsGrade] = (Guid.Parse("5b7e2a10-6c4d-4e8f-8b02-000000000008"), "Grade learner submissions"),
        [PermissionCodes.UsersManage] = (Guid.Parse("5b7e2a10-6c4d-4e8f-8b02-000000000009"), "Manage students and instructors"),
        [PermissionCodes.CoursesManage] = (Guid.Parse("5b7e2a10-6c4d-4e8f-8b02-00000000000a"), "Manage courses"),
        [PermissionCodes.SchedulesManage] = (Guid.Parse("5b7e2a10-6c4d-4e8f-8b02-00000000000b"), "Manage offerings, sessions and locations"),
        [PermissionCodes.PaymentsManage] = (Guid.Parse("5b7e2a10-6c4d-4e8f-8b02-00000000000c"), "View and manage payments"),
        [PermissionCodes.ContentManage] = (Guid.Parse("5b7e2a10-6c4d-4e8f-8b02-00000000000e"), "Manage public website content")
    };

    public static Guid RoleIdFor(string role) => RoleIds[role];

    public static IEnumerable<object> Roles => RoleIds.Select(r => new
    {
        Id = r.Value,
        Name = r.Key,
        Description = (string?)$"{r.Key} role"
    });

    public static IEnumerable<object> Permissions => PermissionRows.Select(p => new
    {
        Id = p.Value.Id,
        Code = p.Key,
        Description = p.Value.Description
    });

    public static IEnumerable<object> RolePermissions => RolePermissionMatrix.Grants
        .SelectMany(g => g.Value.Select(code => new
        {
            RoleId = RoleIds[g.Key],
            PermissionId = PermissionRows[code].Id
        }));
}
