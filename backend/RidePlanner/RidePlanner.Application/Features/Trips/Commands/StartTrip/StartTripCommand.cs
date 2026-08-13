namespace RidePlanner.Application.Features.Trips.Commands.StartTrip;

public sealed record StartTripCommand(
    Guid TripId,
    DateTimeOffset? ActualStart = null);
