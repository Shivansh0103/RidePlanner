using MediatR;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.TravelDocuments.DTOs;
using RidePlanner.Application.Features.TravelDocuments.Mappings;

namespace RidePlanner.Application.Features.TravelDocuments.Commands.UpdateTripDocument;

public sealed class UpdateTripDocumentCommandHandler : IRequestHandler<UpdateTripDocumentCommand, TripDocumentDto?>
{
    private readonly ITripDocumentRepository _documentRepository;

    public UpdateTripDocumentCommandHandler(ITripDocumentRepository documentRepository)
    {
        _documentRepository = documentRepository;
    }

    public async Task<TripDocumentDto?> Handle(
        UpdateTripDocumentCommand request,
        CancellationToken cancellationToken = default)
    {
        var document = await _documentRepository.GetByIdAsync(request.DocumentId, cancellationToken);
        if (document is null || document.TripId != request.TripId)
        {
            return null;
        }

        document.Update(
            request.Title,
            request.Type,
            request.DocumentNumber,
            request.ExpiryDate,
            request.FilePath,
            request.Notes);

        await _documentRepository.SaveChangesAsync(cancellationToken);

        return document.ToDto();
    }
}
