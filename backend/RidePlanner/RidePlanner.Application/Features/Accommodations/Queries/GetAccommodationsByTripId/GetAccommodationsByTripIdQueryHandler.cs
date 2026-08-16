using MediatR;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Accommodations.DTOs;
using RidePlanner.Application.Features.Accommodations.Mappings;

namespace RidePlanner.Application.Features.Accommodations.Queries.GetAccommodationsByTripId;

public sealed class GetAccommodationsByTripIdQueryHandler : IRequestHandler<GetAccommodationsByTripIdQuery, IReadOnlyList<AccommodationResponse>>
{
    private readonly IAccommodationRepository _accommodationRepository;

    public GetAccommodationsByTripIdQueryHandler(IAccommodationRepository accommodationRepository)
    {
        _accommodationRepository = accommodationRepository;
    }

    public async Task<IReadOnlyList<AccommodationResponse>> Handle(
        GetAccommodationsByTripIdQuery request,
        CancellationToken cancellationToken = default)
    {
        var accommodations = await _accommodationRepository.GetByTripIdAsync(
            request.TripId,
            cancellationToken);

        return accommodations
            .Select(a => a.ToResponse())
            .ToList();
    }
}
