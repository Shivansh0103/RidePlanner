using MediatR;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.TravelDocuments.DTOs;
using RidePlanner.Application.Features.TravelDocuments.Mappings;

namespace RidePlanner.Application.Features.TravelDocuments.Queries.GetTripDocument;

public sealed class GetTripDocumentQueryHandler : IRequestHandler<GetTripDocumentQuery, TripDocumentDto?>
{
    private readonly ITripDocumentRepository _documentRepository;

    public GetTripDocumentQueryHandler(ITripDocumentRepository documentRepository)
    {
        _documentRepository = documentRepository;
    }

    public async Task<TripDocumentDto?> Handle(
        GetTripDocumentQuery request,
        CancellationToken cancellationToken = default)
    {
        var document = await _documentRepository.GetByIdAsync(request.DocumentId, cancellationToken);
        if (document is null || document.TripId != request.TripId)
        {
            return null;
        }

        return document.ToDto();
    }
}
