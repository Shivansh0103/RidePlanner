using MediatR;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.TripStops.Commands.DeleteTripStop;

public sealed class DeleteTripStopCommandHandler : IRequestHandler<DeleteTripStopCommand>
{
    private readonly ITripRepository _tripRepository;
    private readonly ITripStopRepository _tripStopRepository;

    public DeleteTripStopCommandHandler(
        ITripRepository tripRepository,
        ITripStopRepository tripStopRepository)
    {
        _tripRepository = tripRepository;
        _tripStopRepository = tripStopRepository;
    }

    public async Task Handle(
        DeleteTripStopCommand request,
        CancellationToken cancellationToken = default)
    {
        var trip = await _tripRepository.GetByIdAsync(
            request.TripId,
            cancellationToken);

        if (trip is null)
            throw new DomainException("Trip not found.");

        var stop = await _tripStopRepository.GetByIdAsync(
            request.StopId,
            cancellationToken);

        if (stop is null || stop.TripId != request.TripId)
            throw new DomainException("Trip stop not found.");

        _tripStopRepository.Remove(stop);

        var remainingStops = (await _tripStopRepository.GetByTripIdAsync(request.TripId, cancellationToken))
            .Where(s => s.Id != request.StopId);
        RidePlanner.Application.Features.TripStops.Services.TripStopSequenceReconciler.Reconcile(remainingStops);

        await _tripStopRepository.SaveChangesAsync(cancellationToken);
    }
}