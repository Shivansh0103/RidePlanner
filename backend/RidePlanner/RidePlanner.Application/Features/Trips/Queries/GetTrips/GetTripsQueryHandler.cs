using RidePlanner.Application.Abstractions.Persistence;
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
        return await _tripRepository.GetAllAsync(
            cancellationToken);
    }
}