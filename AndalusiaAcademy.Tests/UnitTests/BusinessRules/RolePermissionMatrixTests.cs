using AndalusiaAcademy.API.ENUMs;

namespace AndalusiaAcademy.Tests.UnitTests.BusinessRules;

public class RolePermissionMatrixTests
{
    [Fact]
    public void Every_role_has_an_entry_and_only_grants_known_permissions()
    {
        Assert.Equal(AppRoles.All.OrderBy(r => r), RolePermissionMatrix.Grants.Keys.OrderBy(r => r));
        Assert.All(RolePermissionMatrix.Grants.Values.SelectMany(p => p), code => Assert.Contains(code, PermissionCodes.All));
    }

    [Fact]
    public void Every_permission_is_granted_to_at_least_one_role()
    {
        var granted = RolePermissionMatrix.Grants.Values.SelectMany(p => p).ToHashSet();
        Assert.All(PermissionCodes.All, code => Assert.Contains(code, granted));
    }

    [Theory]
    [InlineData(PermissionCodes.UsersManage)]
    [InlineData(PermissionCodes.PaymentsManage)]
    [InlineData(PermissionCodes.SchedulesManage)]
    [InlineData(PermissionCodes.AttendanceRecord)]
    [InlineData(PermissionCodes.SubmissionsGrade)]
    public void Learner_does_not_receive_staff_permissions(string permission)
    {
        Assert.DoesNotContain(permission, RolePermissionMatrix.PermissionsFor([AppRoles.Learner]));
    }

    [Theory]
    [InlineData(PermissionCodes.UsersManage)]
    [InlineData(PermissionCodes.PaymentsManage)]
    [InlineData(PermissionCodes.ApplicationsApply)]
    public void Instructor_cannot_manage_users_payments_or_apply(string permission)
    {
        Assert.DoesNotContain(permission, RolePermissionMatrix.PermissionsFor([AppRoles.Instructor]));
    }

    [Fact]
    public void Permissions_for_multiple_roles_are_a_deduplicated_union()
    {
        var permissions = RolePermissionMatrix.PermissionsFor([AppRoles.Instructor, AppRoles.Admin]);

        Assert.Equal(permissions.Count, permissions.Distinct().Count());
        Assert.Contains(PermissionCodes.UsersManage, permissions);
        Assert.Contains(PermissionCodes.AttendanceRecord, permissions);
    }

    [Fact]
    public void Unknown_roles_grant_nothing()
    {
        Assert.Empty(RolePermissionMatrix.PermissionsFor(["SuperUser"]));
    }
}
