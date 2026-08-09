using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RidePlanner.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAccommodationDomain : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "PlaceId",
                table: "TripStops",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255);

            migrationBuilder.AddColumn<Guid>(
                name: "AccommodationId",
                table: "BudgetEstimates",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Accommodations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TripId = table.Column<Guid>(type: "uuid", nullable: false),
                    TripStopId = table.Column<Guid>(type: "uuid", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    CheckInDate = table.Column<DateOnly>(type: "date", nullable: false),
                    CheckOutDate = table.Column<DateOnly>(type: "date", nullable: false),
                    CheckInTime = table.Column<TimeOnly>(type: "time without time zone", nullable: true),
                    CheckOutTime = table.Column<TimeOnly>(type: "time without time zone", nullable: true),
                    ConfirmationNumber = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    ContactName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    ContactPhone = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Website = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    BookingNotes = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    Cost = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Accommodations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Accommodations_TripStops_TripStopId",
                        column: x => x.TripStopId,
                        principalTable: "TripStops",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Accommodations_Trips_TripId",
                        column: x => x.TripId,
                        principalTable: "Trips",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BudgetEstimates_AccommodationId",
                table: "BudgetEstimates",
                column: "AccommodationId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Accommodations_TripId",
                table: "Accommodations",
                column: "TripId");

            migrationBuilder.CreateIndex(
                name: "IX_Accommodations_TripStopId",
                table: "Accommodations",
                column: "TripStopId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_BudgetEstimates_Accommodations_AccommodationId",
                table: "BudgetEstimates",
                column: "AccommodationId",
                principalTable: "Accommodations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BudgetEstimates_Accommodations_AccommodationId",
                table: "BudgetEstimates");

            migrationBuilder.DropTable(
                name: "Accommodations");

            migrationBuilder.DropIndex(
                name: "IX_BudgetEstimates_AccommodationId",
                table: "BudgetEstimates");

            migrationBuilder.DropColumn(
                name: "AccommodationId",
                table: "BudgetEstimates");

            migrationBuilder.AlterColumn<string>(
                name: "PlaceId",
                table: "TripStops",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255,
                oldNullable: true);
        }
    }
}
