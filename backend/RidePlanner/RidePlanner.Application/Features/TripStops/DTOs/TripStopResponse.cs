namespace RidePlanner.Application.Features.TripStops.DTOs;

public sealed record TripStopResponse(
    Guid Id,
    string Name,
    DateOnly ArrivalDate,
    DateOnly DepartureDate,
    string? Notes,
    int DisplayOrder);