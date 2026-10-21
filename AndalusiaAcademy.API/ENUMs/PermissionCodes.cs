namespace AndalusiaAcademy.API.ENUMs;

/// <summary>
/// Permission codes enforced at the API level via policy-based authorization.
/// Each code is registered as an authorization policy of the same name.
/// </summary>
public static class PermissionCodes
{
    // Learner self-service
    public const string ApplicationsApply = "applications.apply";
    public const string PaymentsPayOwn = "payments.pay-own";
    public const string LearningAccess = "learning.access";
    public const string AssignmentsSubmit = "assignments.submit";

    // Instructor operations
    public const string CohortsViewAssigned = "cohorts.view-assigned";
    public const string AttendanceRecord = "attendance.record";
    public const string AssignmentsManage = "assignments.manage";
    public const string SubmissionsGrade = "submissions.grade";

    // Admin / Manager operations
    public const string UsersManage = "users.manage";
    public const string CoursesManage = "courses.manage";
    public const string SchedulesManage = "schedules.manage";
    public const string PaymentsManage = "payments.manage";

    // Content management (CMS endpoints arrive in the Final Sprint)
    public const string ContentManage = "content.manage";

    public static readonly IReadOnlyList<string> All =
    [
        ApplicationsApply, PaymentsPayOwn, LearningAccess, AssignmentsSubmit,
        CohortsViewAssigned, AttendanceRecord, AssignmentsManage, SubmissionsGrade,
        UsersManage, CoursesManage, SchedulesManage, PaymentsManage,
        ContentManage
    ];
}
