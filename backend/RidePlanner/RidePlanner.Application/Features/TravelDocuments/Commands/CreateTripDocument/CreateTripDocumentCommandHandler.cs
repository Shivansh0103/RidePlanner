using MediatR;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.TravelDocuments.DTOs;
using RidePlanner.Application.Features.TravelDocuments.Mappings;
using RidePlanner.Domain.Entities;

namespace RidePlanner.Application.Features.TravelDocuments.Commands.CreateTripDocument;

public sealed class CreateTripDocumentCommandHandler : IRequestHandler<CreateTripDocumentCommand, TripDocumentDto?>
{
    private readonly ITripRepository _tripRepository;
    private readonly ITripDocumentRepository _documentRepository;

    public CreateTripDocumentCommandHandler(
        ITripRepository tripRepository,
        ITripDocumentRepository documentRepository)
    {
        _tripRepository = tripRepository;
        _documentRepository = documentRepository;
    }

    public async Task<TripDocumentDto?> Handle(
        CreateTripDocumentCommand request,
        CancellationToken cancellationToken = default)
    {
        var trip = await _tripRepository.GetByIdAsync(request.TripId, cancellationToken);
        if (trip is null)
        {
            return null;
        }

        var document = new TripDocument(
            request.TripId,
            request.Title,
            request.Type,
            request.DocumentNumber,
            request.ExpiryDate,
            request.FilePath,
            request.Notes);

        await _documentRepository.AddAsync(document, cancellationToken);
        await _documentRepository.SaveChangesAsync(cancellationToken);

        return document.ToDto();
    }
}
