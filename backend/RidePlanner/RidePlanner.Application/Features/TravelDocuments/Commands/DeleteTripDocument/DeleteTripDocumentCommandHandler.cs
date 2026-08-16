using MediatR;
using RidePlanner.Application.Abstractions.Persistence;

namespace RidePlanner.Application.Features.TravelDocuments.Commands.DeleteTripDocument;

public sealed class DeleteTripDocumentCommandHandler : IRequestHandler<DeleteTripDocumentCommand, bool>
{
    private readonly ITripDocumentRepository _documentRepository;

    public DeleteTripDocumentCommandHandler(ITripDocumentRepository documentRepository)
    {
        _documentRepository = documentRepository;
    }

    public async Task<bool> Handle(
        DeleteTripDocumentCommand request,
        CancellationToken cancellationToken = default)
    {
        var document = await _documentRepository.GetByIdAsync(request.DocumentId, cancellationToken);
        if (document is null || document.TripId != request.TripId)
        {
            return false;
        }

        _documentRepository.Delete(document);
        await _documentRepository.SaveChangesAsync(cancellationToken);

        return true;
    }
}
