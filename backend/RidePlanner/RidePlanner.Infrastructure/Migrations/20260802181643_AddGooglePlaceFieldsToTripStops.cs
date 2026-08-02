using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RidePlanner.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddGooglePlaceFieldsToTripStops : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FormattedAddress",
                table: "TripStops",
                type: "character varying(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<double>(
                name: "Latitude",
                table: "TripStops",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Longitude",
                table: "TripStops",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "PlaceId",
                table: "TripStops",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_TripStops_PlaceId",
                table: "TripStops",
                column: "PlaceId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_TripStops_PlaceId",
                table: "TripStops");

            migrationBuilder.DropColumn(
                name: "FormattedAddress",
                table: "TripStops");

            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "TripStops");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "TripStops");

            migrationBuilder.DropColumn(
                name: "PlaceId",
                table: "TripStops");
        }
    }
}
