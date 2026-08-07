namespace RidePlanner.Application.Features.Budgets.Commands.CalculateFuelEstimate;

public sealed record CalculateFuelEstimateCommand(
    Guid TripId,
    decimal RouteDistanceKm,
    decimal VehicleMileage,
    decimal FuelPricePerLiter);
