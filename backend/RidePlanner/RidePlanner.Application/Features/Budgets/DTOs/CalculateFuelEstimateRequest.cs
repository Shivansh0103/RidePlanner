namespace RidePlanner.Application.Features.Budgets.DTOs;

public sealed class CalculateFuelEstimateRequest
{
    public decimal RouteDistanceKm { get; init; }

    public decimal VehicleMileage { get; init; }

    public decimal FuelPricePerLiter { get; init; }
}
