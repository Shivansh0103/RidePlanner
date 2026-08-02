using RidePlanner.Domain.Enums;

namespace RidePlanner.Application.Features.TripStops.Commands.CreateTripStop;

public sealed record CreateTripStopCommand(
    Guid TripId,
    string Name,
    string PlaceId,
string FormattedAddress,
double Latitude,
double Longitude,
    TripStopCategory Category,
    DateOnly ArrivalDate,
    DateOnly DepartureDate,
    string? Notes,
    int DisplayOrder);