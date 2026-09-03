using MediatR;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.TravelDocuments.DTOs;
using RidePlanner.Application.Features.TravelDocuments.Mappings;
using RidePlanner.Domain.Entities;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.TravelDocuments.Commands.CreateTripDocument;

public sealed class CreateTripDocumentCommandHandler : IRequestHandler<CreateTripDocumentCommand, TripDocumentDto?>
{
    private readonly ITripRepository _tripRepository;
    private readonly ITripDocumentRepository _documentRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;

    public CreateTripDocumentCommandHandler(
        ITripRepository tripRepository,
        ITripDocumentRepository documentRepository,
        IUnitOfWork unitOfWork,
        ICurrentUserService currentUserService)
    {
        _tripRepository = tripRepository;
        _documentRepository = documentRepository;
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
    }

    public async Task<TripDocumentDto?> Handle(
        CreateTripDocumentCommand request,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUserService.UserId
            ?? throw new UnauthorizedException("User is not authenticated.");

        var trip = await _tripRepository.GetByIdAsync(request.TripId, currentUserId, cancellationToken);
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
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return document.ToDto();
    }
}
