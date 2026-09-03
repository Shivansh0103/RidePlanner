using MediatR;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.TravelDocuments.DTOs;
using RidePlanner.Application.Features.TravelDocuments.Mappings;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.TravelDocuments.Queries.GetTripDocuments;

public sealed class GetTripDocumentsQueryHandler : IRequestHandler<GetTripDocumentsQuery, IReadOnlyList<TripDocumentDto>?>
{
    private readonly ITripDocumentRepository _documentRepository;
    private readonly ITripRepository _tripRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetTripDocumentsQueryHandler(
        ITripDocumentRepository documentRepository,
        ITripRepository tripRepository,
        ICurrentUserService currentUserService)
    {
        _documentRepository = documentRepository;
        _tripRepository = tripRepository;
        _currentUserService = currentUserService;
    }

    public async Task<IReadOnlyList<TripDocumentDto>?> Handle(
        GetTripDocumentsQuery request,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUserService.UserId
            ?? throw new UnauthorizedException("User is not authenticated.");

        var trip = await _tripRepository.GetByIdAsync(request.TripId, currentUserId, cancellationToken);
        if (trip is null)
        {
            return null;
        }

        var documents = await _documentRepository.GetByTripIdAsync(request.TripId, cancellationToken);
        return documents.Select(d => d.ToDto()).ToList();
    }
}
