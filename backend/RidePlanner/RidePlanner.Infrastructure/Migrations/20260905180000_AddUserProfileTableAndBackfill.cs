using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RidePlanner.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUserProfileTableAndBackfill : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserProfiles",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    PreferredCurrencyCode = table.Column<string>(type: "character varying(3)", maxLength: 3, nullable: false),
                    DistanceUnit = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    DefaultVehicleName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    DefaultTankCapacityLitres = table.Column<decimal>(type: "numeric(6,2)", precision: 6, scale: 2, nullable: true),
                    DefaultFuelEfficiencyKmPerLitre = table.Column<decimal>(type: "numeric(6,2)", precision: 6, scale: 2, nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserProfiles", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_UserProfiles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.Sql(@"
                INSERT INTO ""UserProfiles"" (
                    ""UserId"", 
                    ""PreferredCurrencyCode"", 
                    ""DistanceUnit"", 
                    ""DefaultVehicleName"", 
                    ""DefaultTankCapacityLitres"", 
                    ""DefaultFuelEfficiencyKmPerLitre"", 
                    ""CreatedAt"", 
                    ""UpdatedAt""
                )
                SELECT 
                    ""Id"", 
                    'INR', 
                    'Kilometers', 
                    NULL, 
                    NULL, 
                    NULL, 
                    NOW(), 
                    NOW()
                FROM ""AspNetUsers""
                WHERE ""Id"" NOT IN (SELECT ""UserId"" FROM ""UserProfiles"");
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserProfiles");
        }
    }
}
