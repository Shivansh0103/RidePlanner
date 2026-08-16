using MediatR;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.TripStops.DTOs;
using RidePlanner.Application.Features.TripStops.Mappings;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.TripStops.Queries.GetTripStops;

public sealed class GetTripStopsQueryHandler : IRequestHandler<GetTripStopsQuery, IReadOnlyList<TripStopResponse>>
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
        GetTripStopsQuery request,
        CancellationToken cancellationToken = default)
    {
        var trip = await _tripRepository.GetByIdAsync(
            request.TripId,
            cancellationToken);

        if (trip is null)
            throw new DomainException("Trip not found.");

        var stops = await _tripStopRepository.GetByTripIdAsync(
            request.TripId,
            cancellationToken);

        return stops
            .Select(stop => stop.ToResponse())
            .ToList();
    }
}