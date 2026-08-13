using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.TravelDocuments.DTOs;
using RidePlanner.Application.Features.TravelDocuments.Mappings;

namespace RidePlanner.Application.Features.TravelDocuments.Queries.GetTripDocuments;

public sealed class GetTripDocumentsQueryHandler
{
    private readonly ITripDocumentRepository _documentRepository;
    private readonly ITripRepository _tripRepository;

    public GetTripDocumentsQueryHandler(
        ITripDocumentRepository documentRepository,
        ITripRepository tripRepository)
    {
        _documentRepository = documentRepository;
        _tripRepository = tripRepository;
    }

    public async Task<IReadOnlyList<TripDocumentDto>?> Handle(
        GetTripDocumentsQuery query,
        CancellationToken cancellationToken = default)
    {
        var trip = await _tripRepository.GetByIdAsync(query.TripId, cancellationToken);
        if (trip is null)
        {
            return null;
        }

        var documents = await _documentRepository.GetByTripIdAsync(query.TripId, cancellationToken);
        return documents.Select(d => d.ToDto()).ToList();
    }
}
