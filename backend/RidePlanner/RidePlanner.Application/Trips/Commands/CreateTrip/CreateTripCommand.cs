namespace RidePlanner.Application.Trips.Commands.CreateTrip;

public sealed record CreateTripCommand(
    string Name,
    string? Description,
    DateOnly StartDate,
    DateOnly EndDate);