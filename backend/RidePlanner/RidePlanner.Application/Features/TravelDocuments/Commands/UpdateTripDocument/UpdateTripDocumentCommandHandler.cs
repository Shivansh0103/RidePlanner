using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.TravelDocuments.DTOs;
using RidePlanner.Application.Features.TravelDocuments.Mappings;

namespace RidePlanner.Application.Features.TravelDocuments.Commands.UpdateTripDocument;

public sealed class UpdateTripDocumentCommandHandler
{
    private readonly ITripDocumentRepository _documentRepository;

    public UpdateTripDocumentCommandHandler(ITripDocumentRepository documentRepository)
    {
        _documentRepository = documentRepository;
    }

    public async Task<TripDocumentDto?> Handle(
        UpdateTripDocumentCommand command,
        CancellationToken cancellationToken = default)
    {
        var document = await _documentRepository.GetByIdAsync(command.DocumentId, cancellationToken);
        if (document is null || document.TripId != command.TripId)
        {
            return null;
        }

        document.Update(
            command.Title,
            command.Type,
            command.DocumentNumber,
            command.ExpiryDate,
            command.FilePath,
            command.Notes);

        await _documentRepository.SaveChangesAsync(cancellationToken);

        return document.ToDto();
    }
}
