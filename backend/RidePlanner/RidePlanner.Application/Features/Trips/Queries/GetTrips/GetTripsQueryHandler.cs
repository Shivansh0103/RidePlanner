using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Trips.Services;
using RidePlanner.Domain.Entities;

namespace RidePlanner.Application.Features.Trips.Queries.GetTrips;

public sealed class GetTripsQueryHandler
{
    private readonly ITripRepository _tripRepository;

    public GetTripsQueryHandler(ITripRepository tripRepository)
    {
        _tripRepository = tripRepository;
    }

    public async Task<IReadOnlyList<Trip>> Handle(
        CancellationToken cancellationToken = default)
    {
        var trips = await _tripRepository.GetAllAsync(cancellationToken);
        TripLifecycleService.SynchronizeLifecycle(trips, DateOnly.FromDateTime(DateTime.UtcNow));

        return trips;
    }
}