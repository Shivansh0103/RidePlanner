using MediatR;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Entities;

namespace RidePlanner.Application.Features.Trips.Queries.GetTrips;

public sealed class GetTripsQueryHandler : IRequestHandler<GetTripsQuery, IReadOnlyList<Trip>>
{
    private readonly ITripRepository _tripRepository;

    public GetTripsQueryHandler(ITripRepository tripRepository)
    {
        _tripRepository = tripRepository;
    }

    public async Task<IReadOnlyList<Trip>> Handle(
        GetTripsQuery request,
        CancellationToken cancellationToken = default)
    {
        return await _tripRepository.GetAllAsync(cancellationToken);
    }
}