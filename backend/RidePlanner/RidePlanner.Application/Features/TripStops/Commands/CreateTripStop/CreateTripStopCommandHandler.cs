using MediatR;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.TripStops.Services;
using RidePlanner.Domain.Entities;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.TripStops.Commands.CreateTripStop;

public sealed class CreateTripStopCommandHandler : IRequestHandler<CreateTripStopCommand, Guid>
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
        CreateTripStopCommand request,
        CancellationToken cancellationToken = default)
    {
        var trip = await _tripRepository.GetByIdAsync(
            request.TripId,
            cancellationToken);

        if (trip is null)
            throw new DomainException("Trip not found.");

        var existingStops = await _tripStopRepository.GetByTripIdAsync(request.TripId, cancellationToken);
        int initialOrder = request.DisplayOrder > 0 ? request.DisplayOrder : existingStops.Count + 1;

        var tripStop = TripStop.Create(
            request.TripId,
            request.Name,
            request.PlaceId,
            request.FormattedAddress,
            request.Latitude,
            request.Longitude,
            request.Category,
            request.ArrivalDate,
            request.DepartureDate,
            request.Notes,
            initialOrder);

        _tripStopRepository.Add(tripStop);

        var allStops = existingStops.Concat(new[] { tripStop });
        TripStopSequenceReconciler.Reconcile(allStops);

        await _tripStopRepository.SaveChangesAsync(cancellationToken);

        return tripStop.Id;
    }
}