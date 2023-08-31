using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StreamFeverAPI.Migrations
{
    public partial class userGroup2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_usergroups_groups_GroupId",
                table: "usergroups");

            migrationBuilder.DropForeignKey(
                name: "FK_usergroups_users_UserId1",
                table: "usergroups");

            migrationBuilder.DropIndex(
                name: "IX_usergroups_UserId1",
                table: "usergroups");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "usergroups");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "usergroups",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "GroupId",
                table: "usergroups",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_usergroups_UserId",
                table: "usergroups",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_usergroups_groups_GroupId",
                table: "usergroups",
                column: "GroupId",
                principalTable: "groups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_usergroups_users_UserId",
                table: "usergroups",
                column: "UserId",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_usergroups_groups_GroupId",
                table: "usergroups");

            migrationBuilder.DropForeignKey(
                name: "FK_usergroups_users_UserId",
                table: "usergroups");

            migrationBuilder.DropIndex(
                name: "IX_usergroups_UserId",
                table: "usergroups");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "usergroups",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "GroupId",
                table: "usergroups",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "UserId1",
                table: "usergroups",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_usergroups_UserId1",
                table: "usergroups",
                column: "UserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_usergroups_groups_GroupId",
                table: "usergroups",
                column: "GroupId",
                principalTable: "groups",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_usergroups_users_UserId1",
                table: "usergroups",
                column: "UserId1",
                principalTable: "users",
                principalColumn: "Id");
        }
    }
}
