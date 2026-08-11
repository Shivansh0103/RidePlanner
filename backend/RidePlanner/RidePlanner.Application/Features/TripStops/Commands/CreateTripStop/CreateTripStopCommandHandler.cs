using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.TripStops.Services;
using RidePlanner.Domain.Entities;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.TripStops.Commands.CreateTripStop;

public sealed class CreateTripStopCommandHandler
{
    private readonly ITripRepository _tripRepository;
    private readonly ITripStopRepository _tripStopRepository;

    public CreateTripStopCommandHandler(
        ITripRepository tripRepository,
        ITripStopRepository tripStopRepository)
    {
        _tripRepository = tripRepository;
        _tripStopRepository = tripStopRepository;
    }

    public async Task<Guid> Handle(
        CreateTripStopCommand command,
        CancellationToken cancellationToken)
    {
        var trip = await _tripRepository.GetByIdAsync(
            command.TripId,
            cancellationToken);

        if (trip is null)
            throw new DomainException("Trip not found.");

        var existingStops = await _tripStopRepository.GetByTripIdAsync(command.TripId, cancellationToken);
        int initialOrder = command.DisplayOrder > 0 ? command.DisplayOrder : existingStops.Count + 1;

        var tripStop = TripStop.Create(
            command.TripId,
            command.Name,
            command.PlaceId,
            command.FormattedAddress,
            command.Latitude,
            command.Longitude,
            command.Category,
            command.ArrivalDate,
            command.DepartureDate,
            command.Notes,
            initialOrder);

        _tripStopRepository.Add(tripStop);

        var allStops = existingStops.Concat(new[] { tripStop });
        TripStopSequenceReconciler.Reconcile(allStops);

        await _tripStopRepository.SaveChangesAsync(cancellationToken);

        return tripStop.Id;
    }
}