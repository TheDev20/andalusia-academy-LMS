using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AndalusiaAcademy.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppUser",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    CountryCode = table.Column<string>(type: "varchar(2)", unicode: false, maxLength: 2, nullable: false),
                    PreferredLanguage = table.Column<string>(type: "varchar(35)", unicode: false, maxLength: 35, nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppUser", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CareerPath",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Slug = table.Column<string>(type: "nvarchar(160)", maxLength: 160, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CareerPath", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Category",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Slug = table.Column<string>(type: "nvarchar(160)", maxLength: 160, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Category", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Course",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Slug = table.Column<string>(type: "nvarchar(160)", maxLength: 160, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PublicationStatus = table.Column<string>(type: "nvarchar(24)", maxLength: 24, nullable: false),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Course", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FAQ",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Question = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Answer = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Sequence = table.Column<int>(type: "int", nullable: false),
                    PublicationStatus = table.Column<string>(type: "nvarchar(24)", maxLength: 24, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FAQ", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Location",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Address = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    MeetingUrl = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Location", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "OutboxMessage",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DeduplicationKey = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Type = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    PayloadJson = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AvailableAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    ProcessedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LeaseOwner = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    LeaseExpiresAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    AttemptCount = table.Column<int>(type: "int", nullable: false),
                    LastError = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OutboxMessage", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Page",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Slug = table.Column<string>(type: "nvarchar(160)", maxLength: 160, nullable: false),
                    PublicationStatus = table.Column<string>(type: "nvarchar(24)", maxLength: 24, nullable: false),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Page", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Permission",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Permission", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Program",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Slug = table.Column<string>(type: "nvarchar(160)", maxLength: 160, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PublicationStatus = table.Column<string>(type: "nvarchar(24)", maxLength: 24, nullable: false),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Program", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Role",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Role", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TermsVersion",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Version = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PublishedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TermsVersion", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WebhookInbox",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Provider = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    ProviderEventId = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    PayloadJson = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(24)", maxLength: 24, nullable: false),
                    AttemptCount = table.Column<int>(type: "int", nullable: false),
                    LastError = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    ReceivedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    ProcessedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WebhookInbox", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AuditEvent",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Action = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ActorUserId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CorrelationId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    TargetId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    TargetType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    OccurredAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    Details = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditEvent", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AuditEvent_AppUser_ActorUserId",
                        column: x => x.ActorUserId,
                        principalTable: "AppUser",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "FileAsset",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ObjectKey = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: false),
                    OriginalName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    MediaType = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    SizeBytes = table.Column<long>(type: "bigint", nullable: false),
                    ScanStatus = table.Column<string>(type: "nvarchar(24)", maxLength: 24, nullable: false),
                    UploadedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UploadedByUserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FileAsset", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FileAsset_AppUser_UploadedByUserId",
                        column: x => x.UploadedByUserId,
                        principalTable: "AppUser",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "InstructorProfile",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Biography = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InstructorProfile", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_InstructorProfile_AppUser_UserId",
                        column: x => x.UserId,
                        principalTable: "AppUser",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MediaAsset",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ObjectKey = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: false),
                    AltText = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    MediaType = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    SizeBytes = table.Column<long>(type: "bigint", nullable: false),
                    ScanStatus = table.Column<string>(type: "nvarchar(24)", maxLength: 24, nullable: false),
                    UploadedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UploadedByUserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MediaAsset", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MediaAsset_AppUser_UploadedByUserId",
                        column: x => x.UploadedByUserId,
                        principalTable: "AppUser",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CareerPathCourse",
                columns: table => new
                {
                    CareerPathId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CourseId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Sequence = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CareerPathCourse", x => new { x.CareerPathId, x.CourseId });
                    table.ForeignKey(
                        name: "FK_CareerPathCourse_CareerPath_CareerPathId",
                        column: x => x.CareerPathId,
                        principalTable: "CareerPath",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CareerPathCourse_Course_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Course",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CourseCategory",
                columns: table => new
                {
                    CourseId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CategoryId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Sequence = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseCategory", x => new { x.CourseId, x.CategoryId });
                    table.ForeignKey(
                        name: "FK_CourseCategory_Category_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Category",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CourseCategory_Course_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Course",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "JobExecution",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OutboxMessageId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    WorkerId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    AttemptNumber = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(24)", maxLength: 24, nullable: false),
                    StartedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    FinishedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    Error = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobExecution", x => x.Id);
                    table.ForeignKey(
                        name: "FK_JobExecution_OutboxMessage_OutboxMessageId",
                        column: x => x.OutboxMessageId,
                        principalTable: "OutboxMessage",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PageSection",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PageId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BlockType = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    PayloadJson = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Sequence = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PageSection", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PageSection_Page_PageId",
                        column: x => x.PageId,
                        principalTable: "Page",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CareerPathProgram",
                columns: table => new
                {
                    CareerPathId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProgramId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Sequence = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CareerPathProgram", x => new { x.CareerPathId, x.ProgramId });
                    table.ForeignKey(
                        name: "FK_CareerPathProgram_CareerPath_CareerPathId",
                        column: x => x.CareerPathId,
                        principalTable: "CareerPath",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CareerPathProgram_Program_ProgramId",
                        column: x => x.ProgramId,
                        principalTable: "Program",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Offering",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Kind = table.Column<string>(type: "nvarchar(8)", maxLength: 8, nullable: false),
                    CourseId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ProgramId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    StartsAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    EndsAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    TimeZoneId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Price = table.Column<decimal>(type: "decimal(19,4)", precision: 19, scale: 4, nullable: false),
                    Currency = table.Column<string>(type: "char(3)", unicode: false, fixedLength: true, maxLength: 3, nullable: false),
                    Capacity = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(24)", maxLength: 24, nullable: false),
                    CompositionFrozenAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Offering", x => x.Id);
                    table.UniqueConstraint("AK_Offering_Id_Kind", x => new { x.Id, x.Kind });
                    table.CheckConstraint("CK_Offering_CourseOrProgram_Exclusive", "([CourseId] IS NOT NULL AND [ProgramId] IS NULL) OR ([CourseId] IS NULL AND [ProgramId] IS NOT NULL)");
                    table.ForeignKey(
                        name: "FK_Offering_Course_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Course",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Offering_Program_ProgramId",
                        column: x => x.ProgramId,
                        principalTable: "Program",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ProgramCategory",
                columns: table => new
                {
                    ProgramId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CategoryId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Sequence = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProgramCategory", x => new { x.ProgramId, x.CategoryId });
                    table.ForeignKey(
                        name: "FK_ProgramCategory_Category_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Category",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProgramCategory_Program_ProgramId",
                        column: x => x.ProgramId,
                        principalTable: "Program",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ProgramCourse",
                columns: table => new
                {
                    ProgramId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CourseId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Sequence = table.Column<int>(type: "int", nullable: false),
                    IsRequired = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProgramCourse", x => new { x.ProgramId, x.CourseId });
                    table.ForeignKey(
                        name: "FK_ProgramCourse_Course_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Course",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProgramCourse_Program_ProgramId",
                        column: x => x.ProgramId,
                        principalTable: "Program",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "RolePermission",
                columns: table => new
                {
                    RoleId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PermissionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RolePermission", x => new { x.RoleId, x.PermissionId });
                    table.ForeignKey(
                        name: "FK_RolePermission_Permission_PermissionId",
                        column: x => x.PermissionId,
                        principalTable: "Permission",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RolePermission_Role_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Role",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UserRole",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RoleId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRole", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_UserRole_AppUser_UserId",
                        column: x => x.UserId,
                        principalTable: "AppUser",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserRole_Role_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Role",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TermsAcceptance",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TermsVersionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AcceptedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TermsAcceptance", x => new { x.UserId, x.TermsVersionId });
                    table.ForeignKey(
                        name: "FK_TermsAcceptance_AppUser_UserId",
                        column: x => x.UserId,
                        principalTable: "AppUser",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TermsAcceptance_TermsVersion_TermsVersionId",
                        column: x => x.TermsVersionId,
                        principalTable: "TermsVersion",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Payout",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    InstructorId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(19,4)", precision: 19, scale: 4, nullable: false),
                    Currency = table.Column<string>(type: "char(3)", unicode: false, fixedLength: true, maxLength: 3, nullable: false),
                    Provider = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    ProviderPayoutId = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    IdempotencyKey = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(24)", maxLength: 24, nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    PaidAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payout", x => x.Id);
                    table.UniqueConstraint("AK_Payout_Id_InstructorId_Currency", x => new { x.Id, x.InstructorId, x.Currency });
                    table.ForeignKey(
                        name: "FK_Payout_InstructorProfile_InstructorId",
                        column: x => x.InstructorId,
                        principalTable: "InstructorProfile",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Partner",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    AccreditationClassification = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    LogoMediaAssetId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    WebsiteUrl = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Partner", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Partner_MediaAsset_LogoMediaAssetId",
                        column: x => x.LogoMediaAssetId,
                        principalTable: "MediaAsset",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Testimonial",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AuthorName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Quote = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MediaAssetId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    PublicationStatus = table.Column<string>(type: "nvarchar(24)", maxLength: 24, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Testimonial", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Testimonial_MediaAsset_MediaAssetId",
                        column: x => x.MediaAssetId,
                        principalTable: "MediaAsset",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PageSectionMedia",
                columns: table => new
                {
                    PageSectionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MediaAssetId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Sequence = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PageSectionMedia", x => new { x.PageSectionId, x.MediaAssetId });
                    table.ForeignKey(
                        name: "FK_PageSectionMedia_MediaAsset_MediaAssetId",
                        column: x => x.MediaAssetId,
                        principalTable: "MediaAsset",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PageSectionMedia_PageSection_PageSectionId",
                        column: x => x.PageSectionId,
                        principalTable: "PageSection",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Announcement",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OfferingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AuthorUserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Body = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PublishedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Announcement", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Announcement_AppUser_AuthorUserId",
                        column: x => x.AuthorUserId,
                        principalTable: "AppUser",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Announcement_Offering_OfferingId",
                        column: x => x.OfferingId,
                        principalTable: "Offering",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Application",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LearnerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OfferingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(24)", maxLength: 24, nullable: false),
                    SubmittedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Application", x => x.Id);
                    table.UniqueConstraint("AK_Application_Id_LearnerId", x => new { x.Id, x.LearnerId });
                    table.ForeignKey(
                        name: "FK_Application_AppUser_LearnerId",
                        column: x => x.LearnerId,
                        principalTable: "AppUser",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Application_Offering_OfferingId",
                        column: x => x.OfferingId,
                        principalTable: "Offering",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Assignment",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CourseOfferingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CourseKind = table.Column<string>(type: "nvarchar(8)", maxLength: 8, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Instructions = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MaxScore = table.Column<decimal>(type: "decimal(19,4)", precision: 19, scale: 4, nullable: false),
                    DueAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(24)", maxLength: 24, nullable: false),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Assignment", x => x.Id);
                    table.UniqueConstraint("AK_Assignment_Id_CourseOfferingId", x => new { x.Id, x.CourseOfferingId });
                    table.ForeignKey(
                        name: "FK_Assignment_Offering_CourseOfferingId_CourseKind",
                        columns: x => new { x.CourseOfferingId, x.CourseKind },
                        principalTable: "Offering",
                        principalColumns: new[] { "Id", "Kind" },
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "InstructorAgreement",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OfferingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    InstructorId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Version = table.Column<int>(type: "int", nullable: false),
                    Rate = table.Column<decimal>(type: "decimal(19,4)", precision: 19, scale: 4, nullable: false),
                    Currency = table.Column<string>(type: "char(3)", unicode: false, fixedLength: true, maxLength: 3, nullable: false),
                    Basis = table.Column<string>(type: "nvarchar(24)", maxLength: 24, nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    AcceptedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InstructorAgreement", x => x.Id);
                    table.UniqueConstraint("AK_InstructorAgreement_Id_InstructorId_Currency", x => new { x.Id, x.InstructorId, x.Currency });
                    table.ForeignKey(
                        name: "FK_InstructorAgreement_InstructorProfile_InstructorId",
                        column: x => x.InstructorId,
                        principalTable: "InstructorProfile",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_InstructorAgreement_Offering_OfferingId",
                        column: x => x.OfferingId,
                        principalTable: "Offering",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "OfferingInstructor",
                columns: table => new
                {
                    OfferingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    InstructorId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OfferingInstructor", x => new { x.OfferingId, x.InstructorId });
                    table.ForeignKey(
                        name: "FK_OfferingInstructor_InstructorProfile_InstructorId",
                        column: x => x.InstructorId,
                        principalTable: "InstructorProfile",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_OfferingInstructor_Offering_OfferingId",
                        column: x => x.OfferingId,
                        principalTable: "Offering",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ProgramOfferingCourse",
                columns: table => new
                {
                    ProgramOfferingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CourseOfferingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProgramKind = table.Column<string>(type: "nvarchar(8)", maxLength: 8, nullable: false),
                    CourseKind = table.Column<string>(type: "nvarchar(8)", maxLength: 8, nullable: false),
                    Sequence = table.Column<int>(type: "int", nullable: false),
                    IsRequired = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProgramOfferingCourse", x => new { x.ProgramOfferingId, x.CourseOfferingId });
                    table.ForeignKey(
                        name: "FK_ProgramOfferingCourse_Offering_CourseOfferingId_CourseKind",
                        columns: x => new { x.CourseOfferingId, x.CourseKind },
                        principalTable: "Offering",
                        principalColumns: new[] { "Id", "Kind" },
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProgramOfferingCourse_Offering_ProgramOfferingId_ProgramKind",
                        columns: x => new { x.ProgramOfferingId, x.ProgramKind },
                        principalTable: "Offering",
                        principalColumns: new[] { "Id", "Kind" },
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Resource",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CourseOfferingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CourseKind = table.Column<string>(type: "nvarchar(8)", maxLength: 8, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Required = table.Column<bool>(type: "bit", nullable: false),
                    Sequence = table.Column<int>(type: "int", nullable: false),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Resource", x => x.Id);
                    table.UniqueConstraint("AK_Resource_Id_CourseOfferingId", x => new { x.Id, x.CourseOfferingId });
                    table.ForeignKey(
                        name: "FK_Resource_Offering_CourseOfferingId_CourseKind",
                        columns: x => new { x.CourseOfferingId, x.CourseKind },
                        principalTable: "Offering",
                        principalColumns: new[] { "Id", "Kind" },
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Session",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CourseOfferingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CourseKind = table.Column<string>(type: "nvarchar(8)", maxLength: 8, nullable: false),
                    LocationId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Title = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    StartsAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    EndsAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(24)", maxLength: 24, nullable: false),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Session", x => x.Id);
                    table.UniqueConstraint("AK_Session_Id_CourseOfferingId", x => new { x.Id, x.CourseOfferingId });
                    table.ForeignKey(
                        name: "FK_Session_Location_LocationId",
                        column: x => x.LocationId,
                        principalTable: "Location",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Session_Offering_CourseOfferingId_CourseKind",
                        columns: x => new { x.CourseOfferingId, x.CourseKind },
                        principalTable: "Offering",
                        principalColumns: new[] { "Id", "Kind" },
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "NotificationRecipient",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AnnouncementId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Channel = table.Column<string>(type: "nvarchar(24)", maxLength: 24, nullable: false),
                    Destination = table.Column<string>(type: "nvarchar(320)", maxLength: 320, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(24)", maxLength: 24, nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    ReadAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NotificationRecipient", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NotificationRecipient_Announcement_AnnouncementId",
                        column: x => x.AnnouncementId,
                        principalTable: "Announcement",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_NotificationRecipient_AppUser_UserId",
                        column: x => x.UserId,
                        principalTable: "AppUser",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Enrollment",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LearnerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(24)", maxLength: 24, nullable: false),
                    EnrolledAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Enrollment", x => x.Id);
                    table.UniqueConstraint("AK_Enrollment_Id_LearnerId", x => new { x.Id, x.LearnerId });
                    table.ForeignKey(
                        name: "FK_Enrollment_AppUser_LearnerId",
                        column: x => x.LearnerId,
                        principalTable: "AppUser",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Enrollment_Application_ApplicationId_LearnerId",
                        columns: x => new { x.ApplicationId, x.LearnerId },
                        principalTable: "Application",
                        principalColumns: new[] { "Id", "LearnerId" },
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SalesOrder",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AmountDue = table.Column<decimal>(type: "decimal(19,4)", precision: 19, scale: 4, nullable: false),
                    Currency = table.Column<string>(type: "char(3)", unicode: false, fixedLength: true, maxLength: 3, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(24)", maxLength: 24, nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SalesOrder", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SalesOrder_Application_ApplicationId",
                        column: x => x.ApplicationId,
                        principalTable: "Application",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SeatReservation",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(24)", maxLength: 24, nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    ExpiresAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SeatReservation", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SeatReservation_Application_ApplicationId",
                        column: x => x.ApplicationId,
                        principalTable: "Application",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "EarningEntry",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    InstructorAgreementId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    InstructorId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SourceKey = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Quantity = table.Column<decimal>(type: "decimal(19,4)", precision: 19, scale: 4, nullable: false),
                    Rate = table.Column<decimal>(type: "decimal(19,4)", precision: 19, scale: 4, nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(19,4)", precision: 19, scale: 4, nullable: false),
                    Currency = table.Column<string>(type: "char(3)", unicode: false, fixedLength: true, maxLength: 3, nullable: false),
                    EarnedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EarningEntry", x => x.Id);
                    table.UniqueConstraint("AK_EarningEntry_Id_InstructorId_Currency", x => new { x.Id, x.InstructorId, x.Currency });
                    table.ForeignKey(
                        name: "FK_EarningEntry_InstructorAgreement_InstructorAgreementId_InstructorId_Currency",
                        columns: x => new { x.InstructorAgreementId, x.InstructorId, x.Currency },
                        principalTable: "InstructorAgreement",
                        principalColumns: new[] { "Id", "InstructorId", "Currency" },
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EarningEntry_InstructorProfile_InstructorId",
                        column: x => x.InstructorId,
                        principalTable: "InstructorProfile",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ResourceAsset",
                columns: table => new
                {
                    ResourceId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FileAssetId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResourceAsset", x => new { x.ResourceId, x.FileAssetId });
                    table.ForeignKey(
                        name: "FK_ResourceAsset_FileAsset_FileAssetId",
                        column: x => x.FileAssetId,
                        principalTable: "FileAsset",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ResourceAsset_Resource_ResourceId",
                        column: x => x.ResourceId,
                        principalTable: "Resource",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DeliveryAttempt",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    NotificationRecipientId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AttemptNumber = table.Column<int>(type: "int", nullable: false),
                    Provider = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    ProviderReference = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Status = table.Column<string>(type: "nvarchar(24)", maxLength: 24, nullable: false),
                    Error = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    AttemptedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    NextRetryAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeliveryAttempt", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DeliveryAttempt_NotificationRecipient_NotificationRecipientId",
                        column: x => x.NotificationRecipientId,
                        principalTable: "NotificationRecipient",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "LearningEnrollment",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    EnrollmentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LearnerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CourseOfferingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CourseKind = table.Column<string>(type: "nvarchar(8)", maxLength: 8, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(24)", maxLength: 24, nullable: false),
                    CompletedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LearningEnrollment", x => x.Id);
                    table.UniqueConstraint("AK_LearningEnrollment_Id_CourseOfferingId", x => new { x.Id, x.CourseOfferingId });
                    table.ForeignKey(
                        name: "FK_LearningEnrollment_AppUser_LearnerId",
                        column: x => x.LearnerId,
                        principalTable: "AppUser",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_LearningEnrollment_Enrollment_EnrollmentId_LearnerId",
                        columns: x => new { x.EnrollmentId, x.LearnerId },
                        principalTable: "Enrollment",
                        principalColumns: new[] { "Id", "LearnerId" },
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_LearningEnrollment_Offering_CourseOfferingId_CourseKind",
                        columns: x => new { x.CourseOfferingId, x.CourseKind },
                        principalTable: "Offering",
                        principalColumns: new[] { "Id", "Kind" },
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PaymentAttempt",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SalesOrderId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(19,4)", precision: 19, scale: 4, nullable: false),
                    Currency = table.Column<string>(type: "char(3)", unicode: false, fixedLength: true, maxLength: 3, nullable: false),
                    Provider = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    ProviderPaymentId = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    IdempotencyKey = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(24)", maxLength: 24, nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    SettledAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaymentAttempt", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PaymentAttempt_SalesOrder_SalesOrderId",
                        column: x => x.SalesOrderId,
                        principalTable: "SalesOrder",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ReservationItem",
                columns: table => new
                {
                    SeatReservationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OfferingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReservationItem", x => new { x.SeatReservationId, x.OfferingId });
                    table.ForeignKey(
                        name: "FK_ReservationItem_Offering_OfferingId",
                        column: x => x.OfferingId,
                        principalTable: "Offering",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ReservationItem_SeatReservation_SeatReservationId",
                        column: x => x.SeatReservationId,
                        principalTable: "SeatReservation",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PayoutAllocation",
                columns: table => new
                {
                    PayoutId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    EarningEntryId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    InstructorId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Currency = table.Column<string>(type: "char(3)", unicode: false, fixedLength: true, maxLength: 3, nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(19,4)", precision: 19, scale: 4, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PayoutAllocation", x => new { x.PayoutId, x.EarningEntryId });
                    table.ForeignKey(
                        name: "FK_PayoutAllocation_EarningEntry_EarningEntryId_InstructorId_Currency",
                        columns: x => new { x.EarningEntryId, x.InstructorId, x.Currency },
                        principalTable: "EarningEntry",
                        principalColumns: new[] { "Id", "InstructorId", "Currency" },
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PayoutAllocation_Payout_PayoutId_InstructorId_Currency",
                        columns: x => new { x.PayoutId, x.InstructorId, x.Currency },
                        principalTable: "Payout",
                        principalColumns: new[] { "Id", "InstructorId", "Currency" },
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Attendance",
                columns: table => new
                {
                    SessionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LearningEnrollmentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CourseOfferingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RecordedByUserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RecordedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(24)", maxLength: 24, nullable: false),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Attendance", x => new { x.SessionId, x.LearningEnrollmentId });
                    table.ForeignKey(
                        name: "FK_Attendance_AppUser_RecordedByUserId",
                        column: x => x.RecordedByUserId,
                        principalTable: "AppUser",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Attendance_LearningEnrollment_LearningEnrollmentId_CourseOfferingId",
                        columns: x => new { x.LearningEnrollmentId, x.CourseOfferingId },
                        principalTable: "LearningEnrollment",
                        principalColumns: new[] { "Id", "CourseOfferingId" },
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Attendance_Session_SessionId_CourseOfferingId",
                        columns: x => new { x.SessionId, x.CourseOfferingId },
                        principalTable: "Session",
                        principalColumns: new[] { "Id", "CourseOfferingId" },
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ResourceProgress",
                columns: table => new
                {
                    ResourceId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LearningEnrollmentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CourseOfferingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CompletedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResourceProgress", x => new { x.ResourceId, x.LearningEnrollmentId });
                    table.ForeignKey(
                        name: "FK_ResourceProgress_LearningEnrollment_LearningEnrollmentId_CourseOfferingId",
                        columns: x => new { x.LearningEnrollmentId, x.CourseOfferingId },
                        principalTable: "LearningEnrollment",
                        principalColumns: new[] { "Id", "CourseOfferingId" },
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ResourceProgress_Resource_ResourceId_CourseOfferingId",
                        columns: x => new { x.ResourceId, x.CourseOfferingId },
                        principalTable: "Resource",
                        principalColumns: new[] { "Id", "CourseOfferingId" },
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Submission",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AssignmentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LearningEnrollmentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CourseOfferingId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AttemptNumber = table.Column<int>(type: "int", nullable: false),
                    Body = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Score = table.Column<decimal>(type: "decimal(19,4)", precision: 19, scale: 4, nullable: true),
                    SubmittedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    GradedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    GradedByUserId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Submission", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Submission_AppUser_GradedByUserId",
                        column: x => x.GradedByUserId,
                        principalTable: "AppUser",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Submission_Assignment_AssignmentId_CourseOfferingId",
                        columns: x => new { x.AssignmentId, x.CourseOfferingId },
                        principalTable: "Assignment",
                        principalColumns: new[] { "Id", "CourseOfferingId" },
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Submission_LearningEnrollment_LearningEnrollmentId_CourseOfferingId",
                        columns: x => new { x.LearningEnrollmentId, x.CourseOfferingId },
                        principalTable: "LearningEnrollment",
                        principalColumns: new[] { "Id", "CourseOfferingId" },
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PaymentAdjustment",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PaymentAttemptId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedByUserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(19,4)", precision: 19, scale: 4, nullable: false),
                    Currency = table.Column<string>(type: "char(3)", unicode: false, fixedLength: true, maxLength: 3, nullable: false),
                    Reason = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaymentAdjustment", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PaymentAdjustment_AppUser_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "AppUser",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PaymentAdjustment_PaymentAttempt_PaymentAttemptId",
                        column: x => x.PaymentAttemptId,
                        principalTable: "PaymentAttempt",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ReconciliationCase",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PaymentAttemptId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Reason = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(24)", maxLength: 24, nullable: false),
                    Resolution = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    OpenedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    ResolvedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReconciliationCase", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReconciliationCase_PaymentAttempt_PaymentAttemptId",
                        column: x => x.PaymentAttemptId,
                        principalTable: "PaymentAttempt",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Refund",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PaymentAttemptId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(19,4)", precision: 19, scale: 4, nullable: false),
                    Currency = table.Column<string>(type: "char(3)", unicode: false, fixedLength: true, maxLength: 3, nullable: false),
                    Reason = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    IdempotencyKey = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ProviderRefundId = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Status = table.Column<string>(type: "nvarchar(24)", maxLength: 24, nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Refund", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Refund_PaymentAttempt_PaymentAttemptId",
                        column: x => x.PaymentAttemptId,
                        principalTable: "PaymentAttempt",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AttendanceCorrection",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SessionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LearningEnrollmentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ActorUserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OldStatus = table.Column<string>(type: "nvarchar(24)", maxLength: 24, nullable: false),
                    NewStatus = table.Column<string>(type: "nvarchar(24)", maxLength: 24, nullable: false),
                    Reason = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    CorrectedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AttendanceCorrection", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AttendanceCorrection_AppUser_ActorUserId",
                        column: x => x.ActorUserId,
                        principalTable: "AppUser",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AttendanceCorrection_Attendance_SessionId_LearningEnrollmentId",
                        columns: x => new { x.SessionId, x.LearningEnrollmentId },
                        principalTable: "Attendance",
                        principalColumns: new[] { "SessionId", "LearningEnrollmentId" },
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SubmissionAsset",
                columns: table => new
                {
                    SubmissionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FileAssetId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubmissionAsset", x => new { x.SubmissionId, x.FileAssetId });
                    table.ForeignKey(
                        name: "FK_SubmissionAsset_FileAsset_FileAssetId",
                        column: x => x.FileAssetId,
                        principalTable: "FileAsset",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SubmissionAsset_Submission_SubmissionId",
                        column: x => x.SubmissionId,
                        principalTable: "Submission",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Announcement_AuthorUserId",
                table: "Announcement",
                column: "AuthorUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Announcement_OfferingId",
                table: "Announcement",
                column: "OfferingId");

            migrationBuilder.CreateIndex(
                name: "IX_Application_LearnerId",
                table: "Application",
                column: "LearnerId");

            migrationBuilder.CreateIndex(
                name: "IX_Application_OfferingId",
                table: "Application",
                column: "OfferingId");

            migrationBuilder.CreateIndex(
                name: "IX_AppUser_Email",
                table: "AppUser",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Assignment_CourseOfferingId_CourseKind",
                table: "Assignment",
                columns: new[] { "CourseOfferingId", "CourseKind" });

            migrationBuilder.CreateIndex(
                name: "IX_Attendance_LearningEnrollmentId_CourseOfferingId",
                table: "Attendance",
                columns: new[] { "LearningEnrollmentId", "CourseOfferingId" });

            migrationBuilder.CreateIndex(
                name: "IX_Attendance_RecordedByUserId",
                table: "Attendance",
                column: "RecordedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Attendance_SessionId_CourseOfferingId",
                table: "Attendance",
                columns: new[] { "SessionId", "CourseOfferingId" });

            migrationBuilder.CreateIndex(
                name: "IX_AttendanceCorrection_ActorUserId",
                table: "AttendanceCorrection",
                column: "ActorUserId");

            migrationBuilder.CreateIndex(
                name: "IX_AttendanceCorrection_SessionId_LearningEnrollmentId",
                table: "AttendanceCorrection",
                columns: new[] { "SessionId", "LearningEnrollmentId" });

            migrationBuilder.CreateIndex(
                name: "IX_AuditEvent_ActorUserId",
                table: "AuditEvent",
                column: "ActorUserId");

            migrationBuilder.CreateIndex(
                name: "IX_CareerPath_Slug",
                table: "CareerPath",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CareerPathCourse_CareerPathId_Sequence",
                table: "CareerPathCourse",
                columns: new[] { "CareerPathId", "Sequence" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CareerPathCourse_CourseId",
                table: "CareerPathCourse",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_CareerPathProgram_CareerPathId_Sequence",
                table: "CareerPathProgram",
                columns: new[] { "CareerPathId", "Sequence" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CareerPathProgram_ProgramId",
                table: "CareerPathProgram",
                column: "ProgramId");

            migrationBuilder.CreateIndex(
                name: "IX_Category_Slug",
                table: "Category",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Course_Slug",
                table: "Course",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CourseCategory_CategoryId",
                table: "CourseCategory",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseCategory_CourseId_Sequence",
                table: "CourseCategory",
                columns: new[] { "CourseId", "Sequence" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DeliveryAttempt_NotificationRecipientId_AttemptNumber",
                table: "DeliveryAttempt",
                columns: new[] { "NotificationRecipientId", "AttemptNumber" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_EarningEntry_InstructorAgreementId_InstructorId_Currency",
                table: "EarningEntry",
                columns: new[] { "InstructorAgreementId", "InstructorId", "Currency" });

            migrationBuilder.CreateIndex(
                name: "IX_EarningEntry_InstructorAgreementId_SourceKey",
                table: "EarningEntry",
                columns: new[] { "InstructorAgreementId", "SourceKey" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_EarningEntry_InstructorId",
                table: "EarningEntry",
                column: "InstructorId");

            migrationBuilder.CreateIndex(
                name: "IX_Enrollment_ApplicationId",
                table: "Enrollment",
                column: "ApplicationId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Enrollment_ApplicationId_LearnerId",
                table: "Enrollment",
                columns: new[] { "ApplicationId", "LearnerId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Enrollment_LearnerId",
                table: "Enrollment",
                column: "LearnerId");

            migrationBuilder.CreateIndex(
                name: "IX_FileAsset_ObjectKey",
                table: "FileAsset",
                column: "ObjectKey",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_FileAsset_UploadedByUserId",
                table: "FileAsset",
                column: "UploadedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_InstructorAgreement_InstructorId",
                table: "InstructorAgreement",
                column: "InstructorId");

            migrationBuilder.CreateIndex(
                name: "IX_InstructorAgreement_OfferingId_InstructorId_Version",
                table: "InstructorAgreement",
                columns: new[] { "OfferingId", "InstructorId", "Version" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_JobExecution_OutboxMessageId_AttemptNumber",
                table: "JobExecution",
                columns: new[] { "OutboxMessageId", "AttemptNumber" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LearningEnrollment_CourseOfferingId_CourseKind",
                table: "LearningEnrollment",
                columns: new[] { "CourseOfferingId", "CourseKind" });

            migrationBuilder.CreateIndex(
                name: "IX_LearningEnrollment_EnrollmentId_CourseOfferingId",
                table: "LearningEnrollment",
                columns: new[] { "EnrollmentId", "CourseOfferingId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LearningEnrollment_EnrollmentId_LearnerId",
                table: "LearningEnrollment",
                columns: new[] { "EnrollmentId", "LearnerId" });

            migrationBuilder.CreateIndex(
                name: "IX_LearningEnrollment_LearnerId_CourseOfferingId",
                table: "LearningEnrollment",
                columns: new[] { "LearnerId", "CourseOfferingId" },
                unique: true,
                filter: "[Status] = 'Active'");

            migrationBuilder.CreateIndex(
                name: "IX_MediaAsset_ObjectKey",
                table: "MediaAsset",
                column: "ObjectKey",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MediaAsset_UploadedByUserId",
                table: "MediaAsset",
                column: "UploadedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_NotificationRecipient_AnnouncementId_UserId_Channel",
                table: "NotificationRecipient",
                columns: new[] { "AnnouncementId", "UserId", "Channel" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_NotificationRecipient_UserId",
                table: "NotificationRecipient",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Offering_CourseId",
                table: "Offering",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_Offering_ProgramId",
                table: "Offering",
                column: "ProgramId");

            migrationBuilder.CreateIndex(
                name: "IX_OfferingInstructor_InstructorId",
                table: "OfferingInstructor",
                column: "InstructorId");

            migrationBuilder.CreateIndex(
                name: "IX_OutboxMessage_DeduplicationKey",
                table: "OutboxMessage",
                column: "DeduplicationKey",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Page_Slug",
                table: "Page",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PageSection_PageId_Sequence",
                table: "PageSection",
                columns: new[] { "PageId", "Sequence" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PageSectionMedia_MediaAssetId",
                table: "PageSectionMedia",
                column: "MediaAssetId");

            migrationBuilder.CreateIndex(
                name: "IX_PageSectionMedia_PageSectionId_Sequence",
                table: "PageSectionMedia",
                columns: new[] { "PageSectionId", "Sequence" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Partner_LogoMediaAssetId",
                table: "Partner",
                column: "LogoMediaAssetId");

            migrationBuilder.CreateIndex(
                name: "IX_PaymentAdjustment_CreatedByUserId",
                table: "PaymentAdjustment",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PaymentAdjustment_PaymentAttemptId",
                table: "PaymentAdjustment",
                column: "PaymentAttemptId");

            migrationBuilder.CreateIndex(
                name: "IX_PaymentAttempt_IdempotencyKey",
                table: "PaymentAttempt",
                column: "IdempotencyKey",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PaymentAttempt_Provider_ProviderPaymentId",
                table: "PaymentAttempt",
                columns: new[] { "Provider", "ProviderPaymentId" },
                unique: true,
                filter: "[ProviderPaymentId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_PaymentAttempt_SalesOrderId",
                table: "PaymentAttempt",
                column: "SalesOrderId");

            migrationBuilder.CreateIndex(
                name: "IX_Payout_IdempotencyKey",
                table: "Payout",
                column: "IdempotencyKey",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Payout_InstructorId",
                table: "Payout",
                column: "InstructorId");

            migrationBuilder.CreateIndex(
                name: "IX_Payout_Provider_ProviderPayoutId",
                table: "Payout",
                columns: new[] { "Provider", "ProviderPayoutId" },
                unique: true,
                filter: "[ProviderPayoutId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_PayoutAllocation_EarningEntryId_InstructorId_Currency",
                table: "PayoutAllocation",
                columns: new[] { "EarningEntryId", "InstructorId", "Currency" });

            migrationBuilder.CreateIndex(
                name: "IX_PayoutAllocation_PayoutId_InstructorId_Currency",
                table: "PayoutAllocation",
                columns: new[] { "PayoutId", "InstructorId", "Currency" });

            migrationBuilder.CreateIndex(
                name: "IX_Permission_Code",
                table: "Permission",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Program_Slug",
                table: "Program",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProgramCategory_CategoryId",
                table: "ProgramCategory",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_ProgramCategory_ProgramId_Sequence",
                table: "ProgramCategory",
                columns: new[] { "ProgramId", "Sequence" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProgramCourse_CourseId",
                table: "ProgramCourse",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_ProgramCourse_ProgramId_Sequence",
                table: "ProgramCourse",
                columns: new[] { "ProgramId", "Sequence" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProgramOfferingCourse_CourseOfferingId_CourseKind",
                table: "ProgramOfferingCourse",
                columns: new[] { "CourseOfferingId", "CourseKind" });

            migrationBuilder.CreateIndex(
                name: "IX_ProgramOfferingCourse_ProgramOfferingId_ProgramKind",
                table: "ProgramOfferingCourse",
                columns: new[] { "ProgramOfferingId", "ProgramKind" });

            migrationBuilder.CreateIndex(
                name: "IX_ProgramOfferingCourse_ProgramOfferingId_Sequence",
                table: "ProgramOfferingCourse",
                columns: new[] { "ProgramOfferingId", "Sequence" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ReconciliationCase_PaymentAttemptId",
                table: "ReconciliationCase",
                column: "PaymentAttemptId");

            migrationBuilder.CreateIndex(
                name: "IX_Refund_IdempotencyKey",
                table: "Refund",
                column: "IdempotencyKey",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Refund_PaymentAttemptId_ProviderRefundId",
                table: "Refund",
                columns: new[] { "PaymentAttemptId", "ProviderRefundId" },
                unique: true,
                filter: "[ProviderRefundId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_ReservationItem_OfferingId",
                table: "ReservationItem",
                column: "OfferingId");

            migrationBuilder.CreateIndex(
                name: "IX_Resource_CourseOfferingId_CourseKind",
                table: "Resource",
                columns: new[] { "CourseOfferingId", "CourseKind" });

            migrationBuilder.CreateIndex(
                name: "IX_Resource_CourseOfferingId_Sequence",
                table: "Resource",
                columns: new[] { "CourseOfferingId", "Sequence" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ResourceAsset_FileAssetId",
                table: "ResourceAsset",
                column: "FileAssetId");

            migrationBuilder.CreateIndex(
                name: "IX_ResourceProgress_LearningEnrollmentId_CourseOfferingId",
                table: "ResourceProgress",
                columns: new[] { "LearningEnrollmentId", "CourseOfferingId" });

            migrationBuilder.CreateIndex(
                name: "IX_ResourceProgress_ResourceId_CourseOfferingId",
                table: "ResourceProgress",
                columns: new[] { "ResourceId", "CourseOfferingId" });

            migrationBuilder.CreateIndex(
                name: "IX_Role_Name",
                table: "Role",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RolePermission_PermissionId",
                table: "RolePermission",
                column: "PermissionId");

            migrationBuilder.CreateIndex(
                name: "IX_SalesOrder_ApplicationId",
                table: "SalesOrder",
                column: "ApplicationId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SeatReservation_ApplicationId",
                table: "SeatReservation",
                column: "ApplicationId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Session_CourseOfferingId_CourseKind",
                table: "Session",
                columns: new[] { "CourseOfferingId", "CourseKind" });

            migrationBuilder.CreateIndex(
                name: "IX_Session_LocationId",
                table: "Session",
                column: "LocationId");

            migrationBuilder.CreateIndex(
                name: "IX_Submission_AssignmentId_CourseOfferingId",
                table: "Submission",
                columns: new[] { "AssignmentId", "CourseOfferingId" });

            migrationBuilder.CreateIndex(
                name: "IX_Submission_AssignmentId_LearningEnrollmentId_AttemptNumber",
                table: "Submission",
                columns: new[] { "AssignmentId", "LearningEnrollmentId", "AttemptNumber" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Submission_GradedByUserId",
                table: "Submission",
                column: "GradedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Submission_LearningEnrollmentId_CourseOfferingId",
                table: "Submission",
                columns: new[] { "LearningEnrollmentId", "CourseOfferingId" });

            migrationBuilder.CreateIndex(
                name: "IX_SubmissionAsset_FileAssetId",
                table: "SubmissionAsset",
                column: "FileAssetId");

            migrationBuilder.CreateIndex(
                name: "IX_TermsAcceptance_TermsVersionId",
                table: "TermsAcceptance",
                column: "TermsVersionId");

            migrationBuilder.CreateIndex(
                name: "IX_TermsVersion_Version",
                table: "TermsVersion",
                column: "Version",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Testimonial_MediaAssetId",
                table: "Testimonial",
                column: "MediaAssetId");

            migrationBuilder.CreateIndex(
                name: "IX_UserRole_RoleId",
                table: "UserRole",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_WebhookInbox_Provider_ProviderEventId",
                table: "WebhookInbox",
                columns: new[] { "Provider", "ProviderEventId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AttendanceCorrection");

            migrationBuilder.DropTable(
                name: "AuditEvent");

            migrationBuilder.DropTable(
                name: "CareerPathCourse");

            migrationBuilder.DropTable(
                name: "CareerPathProgram");

            migrationBuilder.DropTable(
                name: "CourseCategory");

            migrationBuilder.DropTable(
                name: "DeliveryAttempt");

            migrationBuilder.DropTable(
                name: "FAQ");

            migrationBuilder.DropTable(
                name: "JobExecution");

            migrationBuilder.DropTable(
                name: "OfferingInstructor");

            migrationBuilder.DropTable(
                name: "PageSectionMedia");

            migrationBuilder.DropTable(
                name: "Partner");

            migrationBuilder.DropTable(
                name: "PaymentAdjustment");

            migrationBuilder.DropTable(
                name: "PayoutAllocation");

            migrationBuilder.DropTable(
                name: "ProgramCategory");

            migrationBuilder.DropTable(
                name: "ProgramCourse");

            migrationBuilder.DropTable(
                name: "ProgramOfferingCourse");

            migrationBuilder.DropTable(
                name: "ReconciliationCase");

            migrationBuilder.DropTable(
                name: "Refund");

            migrationBuilder.DropTable(
                name: "ReservationItem");

            migrationBuilder.DropTable(
                name: "ResourceAsset");

            migrationBuilder.DropTable(
                name: "ResourceProgress");

            migrationBuilder.DropTable(
                name: "RolePermission");

            migrationBuilder.DropTable(
                name: "SubmissionAsset");

            migrationBuilder.DropTable(
                name: "TermsAcceptance");

            migrationBuilder.DropTable(
                name: "Testimonial");

            migrationBuilder.DropTable(
                name: "UserRole");

            migrationBuilder.DropTable(
                name: "WebhookInbox");

            migrationBuilder.DropTable(
                name: "Attendance");

            migrationBuilder.DropTable(
                name: "CareerPath");

            migrationBuilder.DropTable(
                name: "NotificationRecipient");

            migrationBuilder.DropTable(
                name: "OutboxMessage");

            migrationBuilder.DropTable(
                name: "PageSection");

            migrationBuilder.DropTable(
                name: "EarningEntry");

            migrationBuilder.DropTable(
                name: "Payout");

            migrationBuilder.DropTable(
                name: "Category");

            migrationBuilder.DropTable(
                name: "PaymentAttempt");

            migrationBuilder.DropTable(
                name: "SeatReservation");

            migrationBuilder.DropTable(
                name: "Resource");

            migrationBuilder.DropTable(
                name: "Permission");

            migrationBuilder.DropTable(
                name: "FileAsset");

            migrationBuilder.DropTable(
                name: "Submission");

            migrationBuilder.DropTable(
                name: "TermsVersion");

            migrationBuilder.DropTable(
                name: "MediaAsset");

            migrationBuilder.DropTable(
                name: "Role");

            migrationBuilder.DropTable(
                name: "Session");

            migrationBuilder.DropTable(
                name: "Announcement");

            migrationBuilder.DropTable(
                name: "Page");

            migrationBuilder.DropTable(
                name: "InstructorAgreement");

            migrationBuilder.DropTable(
                name: "SalesOrder");

            migrationBuilder.DropTable(
                name: "Assignment");

            migrationBuilder.DropTable(
                name: "LearningEnrollment");

            migrationBuilder.DropTable(
                name: "Location");

            migrationBuilder.DropTable(
                name: "InstructorProfile");

            migrationBuilder.DropTable(
                name: "Enrollment");

            migrationBuilder.DropTable(
                name: "Application");

            migrationBuilder.DropTable(
                name: "AppUser");

            migrationBuilder.DropTable(
                name: "Offering");

            migrationBuilder.DropTable(
                name: "Course");

            migrationBuilder.DropTable(
                name: "Program");
        }
    }
}
