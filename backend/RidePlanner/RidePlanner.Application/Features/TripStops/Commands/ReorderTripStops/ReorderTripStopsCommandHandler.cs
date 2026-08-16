using MediatR;
using RidePlanner.Application.Abstractions.Persistence;

namespace RidePlanner.Application.Features.TripStops.Commands.ReorderTripStops;

public sealed class ReorderTripStopsCommandHandler : IRequestHandler<ReorderTripStopsCommand>
{
    private readonly ITripStopRepository _tripStopRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ReorderTripStopsCommandHandler(
        ITripStopRepository tripStopRepository,
        IUnitOfWork unitOfWork)
    {
        _tripStopRepository = tripStopRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task Handle(
        ReorderTripStopsCommand request,
        CancellationToken cancellationToken = default)
    {
        await _tripStopRepository.ReorderAsync(
            request.TripId,
            request.OrderedStopIds,
            cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
