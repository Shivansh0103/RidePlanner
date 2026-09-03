using MediatR;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.TripStops.DTOs;
using RidePlanner.Application.Features.TripStops.Mappings;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.TripStops.Queries.GetTripStops;

public sealed class GetTripStopsQueryHandler : IRequestHandler<GetTripStopsQuery, IReadOnlyList<TripStopResponse>>
{
    private readonly ITripRepository _tripRepository;
    private readonly ITripStopRepository _tripStopRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetTripStopsQueryHandler(
        ITripRepository tripRepository,
        ITripStopRepository tripStopRepository,
        ICurrentUserService currentUserService)
    {
        _tripRepository = tripRepository;
        _tripStopRepository = tripStopRepository;
        _currentUserService = currentUserService;
    }

    public async Task<IReadOnlyList<TripStopResponse>> Handle(
        GetTripStopsQuery request,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUserService.UserId
            ?? throw new UnauthorizedException("User is not authenticated.");

        var trip = await _tripRepository.GetByIdAsync(
            request.TripId,
            currentUserId,
            cancellationToken);

        if (trip is null)
            throw new NotFoundException("Trip", request.TripId);

        var stops = await _tripStopRepository.GetByTripIdAsync(
            request.TripId,
            cancellationToken);

        return stops
            .Select(stop => stop.ToResponse())
            .ToList();
    }
}