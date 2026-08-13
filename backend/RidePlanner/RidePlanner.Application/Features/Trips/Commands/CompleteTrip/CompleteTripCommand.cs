namespace RidePlanner.Application.Features.Trips.Commands.CompleteTrip;

public sealed record CompleteTripCommand(
    Guid TripId,
    DateTimeOffset? ActualCompletion = null);
