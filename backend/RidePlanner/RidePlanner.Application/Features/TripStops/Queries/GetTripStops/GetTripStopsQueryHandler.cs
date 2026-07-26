using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.TripStops.DTOs;
using RidePlanner.Application.Features.TripStops.Mappings;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.TripStops.Queries.GetTripStops;

public sealed class GetTripStopsQueryHandler
{
    private readonly ITripRepository _tripRepository;
    private readonly ITripStopRepository _tripStopRepository;

    public GetTripStopsQueryHandler(
        ITripRepository tripRepository,
        ITripStopRepository tripStopRepository)
    {
        _tripRepository = tripRepository;
        _tripStopRepository = tripStopRepository;
    }

    public async Task<IReadOnlyList<TripStopResponse>> Handle(
        GetTripStopsQuery query,
        CancellationToken cancellationToken)
    {
        var trip = await _tripRepository.GetByIdAsync(
            query.TripId,
            cancellationToken);

        if (trip is null)
            throw new DomainException("Trip not found.");

        var stops = await _tripStopRepository.GetByTripIdAsync(
            query.TripId,
            cancellationToken);

        return stops
            .Select(stop => stop.ToResponse())
            .ToList();
    }
}