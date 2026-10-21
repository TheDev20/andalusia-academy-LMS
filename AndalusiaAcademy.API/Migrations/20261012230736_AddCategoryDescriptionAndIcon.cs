using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AndalusiaAcademy.API.Migrations
{
    /// <inheritdoc />
    public partial class AddCategoryDescriptionAndIcon : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Category",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Icon",
                table: "Category",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "Code2");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "Category");

            migrationBuilder.DropColumn(
                name: "Icon",
                table: "Category");
        }
    }
}
