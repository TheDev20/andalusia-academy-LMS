using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AndalusiaAcademy.API.Migrations
{
    /// <inheritdoc />
    public partial class AddCatalogCoveringIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Offering_CourseId",
                table: "Offering");

            migrationBuilder.CreateIndex(
                name: "IX_Program_PublicationStatus_Title",
                table: "Program",
                columns: new[] { "PublicationStatus", "Title" });

            migrationBuilder.CreateIndex(
                name: "IX_Offering_CourseId_Status_StartsAt",
                table: "Offering",
                columns: new[] { "CourseId", "Status", "StartsAt" });

            migrationBuilder.CreateIndex(
                name: "IX_Offering_Status_StartsAt",
                table: "Offering",
                columns: new[] { "Status", "StartsAt" });

            migrationBuilder.CreateIndex(
                name: "IX_Course_PublicationStatus_Title",
                table: "Course",
                columns: new[] { "PublicationStatus", "Title" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Program_PublicationStatus_Title",
                table: "Program");

            migrationBuilder.DropIndex(
                name: "IX_Offering_CourseId_Status_StartsAt",
                table: "Offering");

            migrationBuilder.DropIndex(
                name: "IX_Offering_Status_StartsAt",
                table: "Offering");

            migrationBuilder.DropIndex(
                name: "IX_Course_PublicationStatus_Title",
                table: "Course");

            migrationBuilder.CreateIndex(
                name: "IX_Offering_CourseId",
                table: "Offering",
                column: "CourseId");
        }
    }
}
