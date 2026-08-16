using MediatR;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.TravelDocuments.DTOs;
using RidePlanner.Application.Features.TravelDocuments.Mappings;

namespace RidePlanner.Application.Features.TravelDocuments.Commands.UpdateTripDocument;

public sealed class UpdateTripDocumentCommandHandler : IRequestHandler<UpdateTripDocumentCommand, TripDocumentDto?>
{
    private readonly ITripDocumentRepository _documentRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateTripDocumentCommandHandler(
        ITripDocumentRepository documentRepository,
        IUnitOfWork unitOfWork)
    {
        _documentRepository = documentRepository;
        _unitOfWork = unitOfWork;
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

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return document.ToDto();
    }
}
