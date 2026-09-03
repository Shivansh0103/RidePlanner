using MediatR;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Accommodations.DTOs;
using RidePlanner.Application.Features.Accommodations.Mappings;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.Accommodations.Queries.GetAccommodationById;

public sealed class GetAccommodationByIdQueryHandler : IRequestHandler<GetAccommodationByIdQuery, AccommodationResponse>
{
    private readonly ITripRepository _tripRepository;
    private readonly IAccommodationRepository _accommodationRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetAccommodationByIdQueryHandler(
        ITripRepository tripRepository,
        IAccommodationRepository accommodationRepository,
        ICurrentUserService currentUserService)
    {
        _tripRepository = tripRepository;
        _accommodationRepository = accommodationRepository;
        _currentUserService = currentUserService;
    }

    public async Task<AccommodationResponse> Handle(
        GetAccommodationByIdQuery request,
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

        var accommodation = await _accommodationRepository.GetWithDetailsByIdAsync(
            request.Id,
            cancellationToken);

        if (accommodation is null || accommodation.TripId != request.TripId)
            throw new NotFoundException("Accommodation stay", request.Id);

        return accommodation.ToResponse();
    }
}
