using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StreamFeverAPI.Migrations
{
    public partial class userGroup3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_usergroups_groups_GroupId",
                table: "usergroups");

            migrationBuilder.DropForeignKey(
                name: "FK_usergroups_users_UserId",
                table: "usergroups");

            migrationBuilder.DropIndex(
                name: "IX_usergroups_GroupId",
                table: "usergroups");

            migrationBuilder.DropIndex(
                name: "IX_usergroups_UserId",
                table: "usergroups");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_usergroups_GroupId",
                table: "usergroups",
                column: "GroupId");

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
    }
}
