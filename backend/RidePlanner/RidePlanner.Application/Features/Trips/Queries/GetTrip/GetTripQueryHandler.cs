using MediatR;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Trips.Services;
using RidePlanner.Domain.Entities;

namespace RidePlanner.Application.Features.Trips.Queries.GetTrip;

public sealed class GetTripQueryHandler : IRequestHandler<GetTripQuery, Trip?>
{
    private readonly ITripRepository _tripRepository;

    public GetTripQueryHandler(ITripRepository tripRepository)
    {
        _tripRepository = tripRepository;
    }

    public async Task<Trip?> Handle(
        GetTripQuery request,
        CancellationToken cancellationToken = default)
    {
        var trip = await _tripRepository.GetByIdAsync(
            request.Id,
            cancellationToken);

        if (trip is not null)
        {
            TripLifecycleService.SynchronizeLifecycle(trip, DateOnly.FromDateTime(DateTime.UtcNow));
        }

        return trip;
    }
}