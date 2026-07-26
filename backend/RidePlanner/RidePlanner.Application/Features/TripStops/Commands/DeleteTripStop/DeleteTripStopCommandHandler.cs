using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.TripStops.Commands.DeleteTripStop;

public sealed class DeleteTripStopCommandHandler
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
        DeleteTripStopCommand command,
        CancellationToken cancellationToken)
    {
        var trip = await _tripRepository.GetByIdAsync(
            command.TripId,
            cancellationToken);

        if (trip is null)
            throw new DomainException("Trip not found.");

        var stop = await _tripStopRepository.GetByIdAsync(
            command.StopId,
            cancellationToken);

        if (stop is null || stop.TripId != command.TripId)
            throw new DomainException("Trip stop not found.");

        _tripStopRepository.Remove(stop);

        await _tripStopRepository.SaveChangesAsync(cancellationToken);
    }
}