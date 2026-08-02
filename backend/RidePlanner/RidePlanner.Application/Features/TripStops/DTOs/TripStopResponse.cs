using RidePlanner.Domain.Enums;

namespace RidePlanner.Application.Features.TripStops.DTOs;

public sealed record TripStopResponse(
    Guid Id,
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