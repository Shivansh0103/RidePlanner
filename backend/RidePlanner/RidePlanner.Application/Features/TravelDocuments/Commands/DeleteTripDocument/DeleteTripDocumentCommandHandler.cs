using MediatR;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.TravelDocuments.Commands.DeleteTripDocument;

public sealed class DeleteTripDocumentCommandHandler : IRequestHandler<DeleteTripDocumentCommand, bool>
{
    private readonly ITripRepository _tripRepository;
    private readonly ITripDocumentRepository _documentRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;

    public DeleteTripDocumentCommandHandler(
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

    public async Task<bool> Handle(
        DeleteTripDocumentCommand request,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUserService.UserId
            ?? throw new UnauthorizedException("User is not authenticated.");

        var trip = await _tripRepository.GetByIdAsync(request.TripId, currentUserId, cancellationToken);
        if (trip is null)
        {
            return false;
        }

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
