using RidePlanner.Application.Abstractions.Persistence;

namespace RidePlanner.Application.Features.TravelDocuments.Commands.DeleteTripDocument;

public sealed class DeleteTripDocumentCommandHandler
{
    private readonly ITripDocumentRepository _documentRepository;

    public DeleteTripDocumentCommandHandler(ITripDocumentRepository documentRepository)
    {
        _documentRepository = documentRepository;
    }

    public async Task<bool> Handle(
        DeleteTripDocumentCommand command,
        CancellationToken cancellationToken = default)
    {
        var document = await _documentRepository.GetByIdAsync(command.DocumentId, cancellationToken);
        if (document is null || document.TripId != command.TripId)
        {
            return false;
        }

        _documentRepository.Delete(document);
        await _documentRepository.SaveChangesAsync(cancellationToken);

        return true;
    }
}
