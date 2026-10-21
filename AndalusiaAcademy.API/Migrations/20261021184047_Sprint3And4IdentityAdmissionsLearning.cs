using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AndalusiaAcademy.API.Migrations
{
    /// <inheritdoc />
    public partial class Sprint3And4IdentityAdmissionsLearning : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Application_LearnerId",
                table: "Application");

            migrationBuilder.AddColumn<string>(
                name: "Url",
                table: "Resource",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "PasswordHash",
                table: "AppUser",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "AppUser",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<string>(
                name: "SecurityStamp",
                table: "AppUser",
                type: "varchar(64)",
                unicode: false,
                maxLength: 64,
                nullable: false,
                defaultValue: "");

            // Give pre-existing accounts a real stamp so revocation works for them too.
            migrationBuilder.Sql(
                "UPDATE [AppUser] SET [SecurityStamp] = LOWER(REPLACE(CONVERT(varchar(36), NEWID()), '-', '')) WHERE [SecurityStamp] = '';");

            migrationBuilder.CreateTable(
                name: "PasswordResetToken",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TokenHash = table.Column<string>(type: "char(64)", unicode: false, fixedLength: true, maxLength: 64, nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    ExpiresAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UsedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PasswordResetToken", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PasswordResetToken_AppUser_UserId",
                        column: x => x.UserId,
                        principalTable: "AppUser",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Permission",
                columns: new[] { "Id", "Code", "Description" },
                values: new object[,]
                {
                    { new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000001"), "applications.apply", "Submit and manage own applications" },
                    { new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000002"), "payments.pay-own", "Check out and pay own orders" },
                    { new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000003"), "learning.access", "Access enrolled course learning pages" },
                    { new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000004"), "assignments.submit", "Submit assignments" },
                    { new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000005"), "cohorts.view-assigned", "View assigned cohorts and learner progress" },
                    { new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000006"), "attendance.record", "Record and correct session attendance" },
                    { new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000007"), "assignments.manage", "Create and edit assignments" },
                    { new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000008"), "submissions.grade", "Grade learner submissions" },
                    { new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000009"), "users.manage", "Manage students and instructors" },
                    { new Guid("5b7e2a10-6c4d-4e8f-8b02-00000000000a"), "courses.manage", "Manage courses" },
                    { new Guid("5b7e2a10-6c4d-4e8f-8b02-00000000000b"), "schedules.manage", "Manage offerings, sessions and locations" },
                    { new Guid("5b7e2a10-6c4d-4e8f-8b02-00000000000c"), "payments.manage", "View and manage payments" },
                    { new Guid("5b7e2a10-6c4d-4e8f-8b02-00000000000e"), "content.manage", "Manage public website content" }
                });

            migrationBuilder.InsertData(
                table: "Role",
                columns: new[] { "Id", "Description", "Name" },
                values: new object[,]
                {
                    { new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000001"), "Learner role", "Learner" },
                    { new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000002"), "Instructor role", "Instructor" },
                    { new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000003"), "Admin role", "Admin" },
                    { new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000004"), "ContentManager role", "ContentManager" }
                });

            migrationBuilder.InsertData(
                table: "RolePermission",
                columns: new[] { "PermissionId", "RoleId" },
                values: new object[,]
                {
                    { new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000001"), new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000001") },
                    { new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000002"), new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000001") },
                    { new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000003"), new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000001") },
                    { new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000004"), new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000001") },
                    { new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000005"), new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000002") },
                    { new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000006"), new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000002") },
                    { new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000007"), new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000002") },
                    { new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000008"), new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000002") },
                    { new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000005"), new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000003") },
                    { new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000006"), new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000003") },
                    { new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000007"), new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000003") },
                    { new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000008"), new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000003") },
                    { new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000009"), new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000003") },
                    { new Guid("5b7e2a10-6c4d-4e8f-8b02-00000000000a"), new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000003") },
                    { new Guid("5b7e2a10-6c4d-4e8f-8b02-00000000000b"), new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000003") },
                    { new Guid("5b7e2a10-6c4d-4e8f-8b02-00000000000c"), new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000003") },
                    { new Guid("5b7e2a10-6c4d-4e8f-8b02-00000000000a"), new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000004") },
                    { new Guid("5b7e2a10-6c4d-4e8f-8b02-00000000000e"), new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000004") }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Application_LearnerId_OfferingId",
                table: "Application",
                columns: new[] { "LearnerId", "OfferingId" },
                unique: true,
                filter: "[Status] IN ('Submitted', 'Accepted')");

            migrationBuilder.CreateIndex(
                name: "IX_PasswordResetToken_TokenHash",
                table: "PasswordResetToken",
                column: "TokenHash",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PasswordResetToken_UserId_ExpiresAt",
                table: "PasswordResetToken",
                columns: new[] { "UserId", "ExpiresAt" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PasswordResetToken");

            migrationBuilder.DropIndex(
                name: "IX_Application_LearnerId_OfferingId",
                table: "Application");

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000001"), new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000001") });

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000002"), new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000001") });

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000003"), new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000001") });

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000004"), new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000001") });

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000005"), new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000002") });

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000006"), new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000002") });

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000007"), new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000002") });

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000008"), new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000002") });

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000005"), new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000003") });

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000006"), new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000003") });

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000007"), new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000003") });

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000008"), new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000003") });

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000009"), new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000003") });

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("5b7e2a10-6c4d-4e8f-8b02-00000000000a"), new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000003") });

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("5b7e2a10-6c4d-4e8f-8b02-00000000000b"), new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000003") });

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("5b7e2a10-6c4d-4e8f-8b02-00000000000c"), new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000003") });

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("5b7e2a10-6c4d-4e8f-8b02-00000000000a"), new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000004") });

            migrationBuilder.DeleteData(
                table: "RolePermission",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("5b7e2a10-6c4d-4e8f-8b02-00000000000e"), new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000004") });

            migrationBuilder.DeleteData(
                table: "Permission",
                keyColumn: "Id",
                keyValue: new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000001"));

            migrationBuilder.DeleteData(
                table: "Permission",
                keyColumn: "Id",
                keyValue: new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000002"));

            migrationBuilder.DeleteData(
                table: "Permission",
                keyColumn: "Id",
                keyValue: new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000003"));

            migrationBuilder.DeleteData(
                table: "Permission",
                keyColumn: "Id",
                keyValue: new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000004"));

            migrationBuilder.DeleteData(
                table: "Permission",
                keyColumn: "Id",
                keyValue: new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000005"));

            migrationBuilder.DeleteData(
                table: "Permission",
                keyColumn: "Id",
                keyValue: new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000006"));

            migrationBuilder.DeleteData(
                table: "Permission",
                keyColumn: "Id",
                keyValue: new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000007"));

            migrationBuilder.DeleteData(
                table: "Permission",
                keyColumn: "Id",
                keyValue: new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000008"));

            migrationBuilder.DeleteData(
                table: "Permission",
                keyColumn: "Id",
                keyValue: new Guid("5b7e2a10-6c4d-4e8f-8b02-000000000009"));

            migrationBuilder.DeleteData(
                table: "Permission",
                keyColumn: "Id",
                keyValue: new Guid("5b7e2a10-6c4d-4e8f-8b02-00000000000a"));

            migrationBuilder.DeleteData(
                table: "Permission",
                keyColumn: "Id",
                keyValue: new Guid("5b7e2a10-6c4d-4e8f-8b02-00000000000b"));

            migrationBuilder.DeleteData(
                table: "Permission",
                keyColumn: "Id",
                keyValue: new Guid("5b7e2a10-6c4d-4e8f-8b02-00000000000c"));

            migrationBuilder.DeleteData(
                table: "Permission",
                keyColumn: "Id",
                keyValue: new Guid("5b7e2a10-6c4d-4e8f-8b02-00000000000e"));

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000001"));

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000002"));

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000003"));

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: new Guid("8f1c0d5e-3a7b-4c1d-9a01-000000000004"));

            migrationBuilder.DropColumn(
                name: "Url",
                table: "Resource");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "AppUser");

            migrationBuilder.DropColumn(
                name: "SecurityStamp",
                table: "AppUser");

            migrationBuilder.AlterColumn<string>(
                name: "PasswordHash",
                table: "AppUser",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500);

            migrationBuilder.CreateIndex(
                name: "IX_Application_LearnerId",
                table: "Application",
                column: "LearnerId");
        }
    }
}
