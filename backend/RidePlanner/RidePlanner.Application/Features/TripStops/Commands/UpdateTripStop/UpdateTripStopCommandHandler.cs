using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.TripStops.Services;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.TripStops.Commands.UpdateTripStop;

public sealed class UpdateTripStopCommandHandler
{
    private readonly ITripRepository _tripRepository;
    private readonly ITripStopRepository _tripStopRepository;

    public UpdateTripStopCommandHandler(
        ITripRepository tripRepository,
        ITripStopRepository tripStopRepository)
    {
        _tripRepository = tripRepository;
        _tripStopRepository = tripStopRepository;
    }

    public async Task Handle(
        UpdateTripStopCommand command,
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

        int orderToUse = command.DisplayOrder > 0 ? command.DisplayOrder : stop.DisplayOrder;

        stop.Update(
            command.Name,
            command.PlaceId,
            command.FormattedAddress,
            command.Latitude,
            command.Longitude,
            command.Category,
            command.ArrivalDate,
            command.DepartureDate,
            command.Notes,
            orderToUse);

        var allStops = await _tripStopRepository.GetByTripIdAsync(command.TripId, cancellationToken);
        TripStopSequenceReconciler.Reconcile(allStops);

        await _tripStopRepository.SaveChangesAsync(cancellationToken);
    }
}