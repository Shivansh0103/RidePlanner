using MediatR;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.TravelDocuments.DTOs;
using RidePlanner.Application.Features.TravelDocuments.Mappings;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.TravelDocuments.Queries.GetTripDocument;

public sealed class GetTripDocumentQueryHandler : IRequestHandler<GetTripDocumentQuery, TripDocumentDto?>
{
    private readonly ITripRepository _tripRepository;
    private readonly ITripDocumentRepository _documentRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetTripDocumentQueryHandler(
        ITripRepository tripRepository,
        ITripDocumentRepository documentRepository,
        ICurrentUserService currentUserService)
    {
        _tripRepository = tripRepository;
        _documentRepository = documentRepository;
        _currentUserService = currentUserService;
    }

    public async Task<TripDocumentDto?> Handle(
        GetTripDocumentQuery request,
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

        return document.ToDto();
    }
}
