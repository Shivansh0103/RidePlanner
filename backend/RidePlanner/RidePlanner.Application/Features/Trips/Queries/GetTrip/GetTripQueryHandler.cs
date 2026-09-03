using MediatR;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Entities;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.Trips.Queries.GetTrip;

public sealed class GetTripQueryHandler : IRequestHandler<GetTripQuery, Trip?>
{
    private readonly ITripRepository _tripRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetTripQueryHandler(
        ITripRepository tripRepository,
        ICurrentUserService currentUserService)
    {
        _tripRepository = tripRepository;
        _currentUserService = currentUserService;
    }

    public async Task<Trip?> Handle(
        GetTripQuery request,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUserService.UserId
            ?? throw new UnauthorizedException("User is not authenticated.");

        return await _tripRepository.GetByIdAsync(
            request.Id,
            currentUserId,
            cancellationToken);
    }
}