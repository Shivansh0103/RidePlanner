using MediatR;

namespace RidePlanner.Application.Features.TripStops.Commands.ReorderTripStops;

public sealed record ReorderTripStopsCommand(
    Guid TripId,
    IReadOnlyList<Guid> OrderedStopIds) : IRequest;
