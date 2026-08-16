using MediatR;
using RidePlanner.Application.Abstractions.Persistence;

namespace RidePlanner.Application.Features.TravelDocuments.Commands.DeleteTripDocument;

public sealed class DeleteTripDocumentCommandHandler : IRequestHandler<DeleteTripDocumentCommand, bool>
{
    private readonly ITripDocumentRepository _documentRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteTripDocumentCommandHandler(
        ITripDocumentRepository documentRepository,
        IUnitOfWork unitOfWork)
    {
        _documentRepository = documentRepository;
        _unitOfWork = unitOfWork;
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
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }
}
