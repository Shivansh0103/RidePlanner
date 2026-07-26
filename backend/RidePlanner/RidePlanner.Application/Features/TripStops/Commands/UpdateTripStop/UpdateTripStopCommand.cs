namespace RidePlanner.Application.Features.TripStops.Commands.UpdateTripStop;

public sealed record UpdateTripStopCommand(
    Guid TripId,
    Guid StopId,
    string Name,
    DateOnly ArrivalDate,
    DateOnly DepartureDate,
    string? Notes,
    int DisplayOrder);