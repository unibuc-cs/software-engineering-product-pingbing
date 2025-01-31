using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace CollectifyAPI.Migrations
{
    /// <inheritdoc />
    public partial class mig3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "3d17fc61-5b66-4127-9fa3-443ea26484d7");

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "731fbe7c-3d4f-42c1-92a7-efbc29b32fd1", "a761f656-6c13-4bf1-ab4c-df080af0b75b" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "731fbe7c-3d4f-42c1-92a7-efbc29b32fd1");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "a761f656-6c13-4bf1-ab4c-df080af0b75b");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "5f4b3f8d-cbe5-4c17-9eca-19abfa58c7be", null, "user", "USER" },
                    { "b8768963-39fb-4894-a8b3-523287661807", null, "admin", "ADMIN" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "AvatarPath", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "Nickname", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "021b4677-42ee-4a0d-91a6-b1e93b1f1e3b", 0, null, "71880f39-b889-4e7d-932b-9b641cd68ef8", "admin@collectify-app.ro", true, false, null, null, "ADMIN@COLLECTIFY-APP.RO", "ADMIN", "AQAAAAIAAYagAAAAELq+xsw/RC7ONGQoVsWXlafynb61y8RrzQLIQt09I7nVJMWqRkX+uLazYz5yi6LrJQ==", null, false, "5261ed1f-67c1-49d9-aabb-3c2475446dfc", false, "admin" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "b8768963-39fb-4894-a8b3-523287661807", "021b4677-42ee-4a0d-91a6-b1e93b1f1e3b" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "5f4b3f8d-cbe5-4c17-9eca-19abfa58c7be");

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "b8768963-39fb-4894-a8b3-523287661807", "021b4677-42ee-4a0d-91a6-b1e93b1f1e3b" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b8768963-39fb-4894-a8b3-523287661807");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "021b4677-42ee-4a0d-91a6-b1e93b1f1e3b");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "3d17fc61-5b66-4127-9fa3-443ea26484d7", null, "user", "USER" },
                    { "731fbe7c-3d4f-42c1-92a7-efbc29b32fd1", null, "admin", "ADMIN" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "AvatarPath", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "Nickname", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "a761f656-6c13-4bf1-ab4c-df080af0b75b", 0, null, "fd17ff01-a947-4281-b185-1f9da4c9ab61", "admin@collectify-app.ro", true, false, null, null, "ADMIN@COLLECTIFY-APP.RO", "ADMIN", "AQAAAAIAAYagAAAAEKb9XHnT5imT1srscplGUu5iQfPqeg7DbOwDCT0zBBUxscpVFd0fGtke82GLOq3Njg==", null, false, "9c5c5f6d-d447-425e-a973-d747b2e38619", false, "admin" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "731fbe7c-3d4f-42c1-92a7-efbc29b32fd1", "a761f656-6c13-4bf1-ab4c-df080af0b75b" });
        }
    }
}
