using MediatR;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.TravelDocuments.DTOs;
using RidePlanner.Application.Features.TravelDocuments.Mappings;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.TravelDocuments.Commands.UpdateTripDocument;

public sealed class UpdateTripDocumentCommandHandler : IRequestHandler<UpdateTripDocumentCommand, TripDocumentDto?>
{
    private readonly ITripRepository _tripRepository;
    private readonly ITripDocumentRepository _documentRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;

    public UpdateTripDocumentCommandHandler(
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
        UpdateTripDocumentCommand request,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUserService.UserId
            ?? throw new UnauthorizedException("User is not authenticated.");

        var trip = await _tripRepository.GetByIdAsync(request.TripId, currentUserId, cancellationToken);
        if (trip is null)
        {
            return null;
        }

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
