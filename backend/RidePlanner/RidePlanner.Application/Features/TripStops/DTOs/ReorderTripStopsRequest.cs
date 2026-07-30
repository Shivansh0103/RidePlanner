namespace RidePlanner.Application.Features.TripStops.DTOs;

public sealed record ReorderTripStopsRequest(
    IReadOnlyList<Guid> OrderedStopIds);
