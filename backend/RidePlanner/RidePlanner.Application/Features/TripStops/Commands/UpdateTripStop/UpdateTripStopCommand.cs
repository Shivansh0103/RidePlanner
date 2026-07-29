using RidePlanner.Domain.Enums;

namespace RidePlanner.Application.Features.TripStops.Commands.UpdateTripStop;

public sealed record UpdateTripStopCommand(
    Guid TripId,
    Guid StopId,
    string Name,
    TripStopCategory Category,
    DateOnly ArrivalDate,
    DateOnly DepartureDate,
    string? Notes,
    int DisplayOrder);