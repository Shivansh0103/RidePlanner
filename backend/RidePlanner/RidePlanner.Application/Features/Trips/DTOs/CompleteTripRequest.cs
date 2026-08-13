namespace RidePlanner.Application.Features.Trips.DTOs;

public record CompleteTripRequest(DateTimeOffset? ActualCompletion = null);
