using MediatR;
using RidePlanner.Application.Abstractions.Persistence;

namespace RidePlanner.Application.Features.TripStops.Commands.ReorderTripStops;

public sealed class ReorderTripStopsCommandHandler : IRequestHandler<ReorderTripStopsCommand>
{
    private readonly ITripStopRepository _tripStopRepository;

    public ReorderTripStopsCommandHandler(ITripStopRepository tripStopRepository)
    {
        _tripStopRepository = tripStopRepository;
    }

    public async Task Handle(
        ReorderTripStopsCommand request,
        CancellationToken cancellationToken = default)
    {
        await _tripStopRepository.ReorderAsync(
            request.TripId,
            request.OrderedStopIds,
            cancellationToken);
    }
}
