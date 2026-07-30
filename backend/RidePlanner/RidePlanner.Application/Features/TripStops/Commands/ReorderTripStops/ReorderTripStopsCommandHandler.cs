using RidePlanner.Application.Abstractions.Persistence;

namespace RidePlanner.Application.Features.TripStops.Commands.ReorderTripStops;

public sealed class ReorderTripStopsCommandHandler
{
    private readonly ITripStopRepository _tripStopRepository;

    public ReorderTripStopsCommandHandler(ITripStopRepository tripStopRepository)
    {
        _tripStopRepository = tripStopRepository;
    }

    public async Task Handle(
        ReorderTripStopsCommand command,
        CancellationToken cancellationToken = default)
    {
        await _tripStopRepository.ReorderAsync(
            command.TripId,
            command.OrderedStopIds,
            cancellationToken);
    }
}
