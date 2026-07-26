namespace RidePlanner.Application.Features.TripStops.Commands.CreateTripStop;

public sealed record CreateTripStopCommand(
    Guid TripId,
    string Name,
    DateOnly ArrivalDate,
    DateOnly DepartureDate,
    string? Notes,
    int DisplayOrder);