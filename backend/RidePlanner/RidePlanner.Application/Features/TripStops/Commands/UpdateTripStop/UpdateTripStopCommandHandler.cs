using MediatR;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.TripStops.Services;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.TripStops.Commands.UpdateTripStop;

public sealed class UpdateTripStopCommandHandler : IRequestHandler<UpdateTripStopCommand>
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
        UpdateTripStopCommand request,
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

        int orderToUse = request.DisplayOrder > 0 ? request.DisplayOrder : stop.DisplayOrder;

        stop.Update(
            request.Name,
            request.PlaceId,
            request.FormattedAddress,
            request.Latitude,
            request.Longitude,
            request.Category,
            request.ArrivalDate,
            request.DepartureDate,
            request.Notes,
            orderToUse);

        var allStops = await _tripStopRepository.GetByTripIdAsync(request.TripId, cancellationToken);
        TripStopSequenceReconciler.Reconcile(allStops);

        await _tripStopRepository.SaveChangesAsync(cancellationToken);
    }
}