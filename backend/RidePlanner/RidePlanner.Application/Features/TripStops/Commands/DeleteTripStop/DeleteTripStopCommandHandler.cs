using MediatR;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Exceptions;
using RidePlanner.Domain.Services;

namespace RidePlanner.Application.Features.TripStops.Commands.DeleteTripStop;

public sealed class DeleteTripStopCommandHandler : IRequestHandler<DeleteTripStopCommand>
{
    private readonly ITripRepository _tripRepository;
    private readonly ITripStopRepository _tripStopRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteTripStopCommandHandler(
        ITripRepository tripRepository,
        ITripStopRepository tripStopRepository,
        IUnitOfWork unitOfWork)
    {
        _tripRepository = tripRepository;
        _tripStopRepository = tripStopRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task Handle(
        DeleteTripStopCommand request,
        CancellationToken cancellationToken = default)
    {
        var trip = await _tripRepository.GetByIdAsync(
            request.TripId,
            cancellationToken);

        if (trip is null)
            throw new NotFoundException("Trip", request.TripId);

        var stop = await _tripStopRepository.GetByIdAsync(
            request.StopId,
            cancellationToken);

        if (stop is null || stop.TripId != request.TripId)
            throw new NotFoundException("TripStop", request.StopId);

        _tripStopRepository.Remove(stop);

        var remainingStops = (await _tripStopRepository.GetByTripIdAsync(request.TripId, cancellationToken))
            .Where(s => s.Id != request.StopId);
        TripStopReconciler.Reconcile(remainingStops);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}