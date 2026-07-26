using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Entities;

namespace RidePlanner.Application.Features.Trips.Queries.GetTrip;

public sealed class GetTripQueryHandler
{
    private readonly ITripRepository _tripRepository;

    public GetTripQueryHandler(ITripRepository tripRepository)
    {
        _tripRepository = tripRepository;
    }

    public async Task<Trip?> Handle(
        GetTripQuery query,
        CancellationToken cancellationToken = default)
    {
        return await _tripRepository.GetByIdAsync(
            query.Id,
            cancellationToken);
    }
}