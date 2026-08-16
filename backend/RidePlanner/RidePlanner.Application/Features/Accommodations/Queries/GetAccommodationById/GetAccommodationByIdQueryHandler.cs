using MediatR;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Accommodations.DTOs;
using RidePlanner.Application.Features.Accommodations.Mappings;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.Accommodations.Queries.GetAccommodationById;

public sealed class GetAccommodationByIdQueryHandler : IRequestHandler<GetAccommodationByIdQuery, AccommodationResponse>
{
    private readonly IAccommodationRepository _accommodationRepository;

    public GetAccommodationByIdQueryHandler(IAccommodationRepository accommodationRepository)
    {
        _accommodationRepository = accommodationRepository;
    }

    public async Task<AccommodationResponse> Handle(
        GetAccommodationByIdQuery request,
        CancellationToken cancellationToken = default)
    {
        var accommodation = await _accommodationRepository.GetWithDetailsByIdAsync(
            request.Id,
            cancellationToken);

        if (accommodation is null || accommodation.TripId != request.TripId)
            throw new DomainException("Accommodation stay not found.");

        return accommodation.ToResponse();
    }
}
