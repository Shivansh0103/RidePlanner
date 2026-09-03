using MediatR;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Accommodations.DTOs;
using RidePlanner.Application.Features.Accommodations.Mappings;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.Accommodations.Queries.GetAccommodationsByTripId;

public sealed class GetAccommodationsByTripIdQueryHandler : IRequestHandler<GetAccommodationsByTripIdQuery, IReadOnlyList<AccommodationResponse>>
{
    private readonly ITripRepository _tripRepository;
    private readonly IAccommodationRepository _accommodationRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetAccommodationsByTripIdQueryHandler(
        ITripRepository tripRepository,
        IAccommodationRepository accommodationRepository,
        ICurrentUserService currentUserService)
    {
        _tripRepository = tripRepository;
        _accommodationRepository = accommodationRepository;
        _currentUserService = currentUserService;
    }

    public async Task<IReadOnlyList<AccommodationResponse>> Handle(
        GetAccommodationsByTripIdQuery request,
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

        var accommodations = await _accommodationRepository.GetByTripIdAsync(
            request.TripId,
            cancellationToken);

        return accommodations
            .Select(a => a.ToResponse())
            .ToList();
    }
}
