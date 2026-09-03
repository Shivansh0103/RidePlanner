using MediatR;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Entities;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.Trips.Queries.GetTrips;

public sealed class GetTripsQueryHandler : IRequestHandler<GetTripsQuery, IReadOnlyList<Trip>>
{
    private readonly ITripRepository _tripRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetTripsQueryHandler(
        ITripRepository tripRepository,
        ICurrentUserService currentUserService)
    {
        _tripRepository = tripRepository;
        _currentUserService = currentUserService;
    }

    public async Task<IReadOnlyList<Trip>> Handle(
        GetTripsQuery request,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUserService.UserId
            ?? throw new UnauthorizedException("User is not authenticated.");

        return await _tripRepository.GetAllAsync(currentUserId, cancellationToken);
    }
}