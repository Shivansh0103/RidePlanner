namespace RidePlanner.Application.Trips.Commands.UpdateTrip;

public sealed record UpdateTripCommand(
    Guid Id,
    string Name,
    string? Description,
    DateOnly StartDate,
    DateOnly EndDate);