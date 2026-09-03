using MediatR;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Checklists.DTOs;
using RidePlanner.Application.Features.Checklists.Mappings;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.Checklists.Queries.GetTripChecklist;

public sealed class GetTripChecklistQueryHandler : IRequestHandler<GetTripChecklistQuery, ChecklistSummaryDto?>
{
    private readonly IChecklistRepository _checklistRepository;
    private readonly ITripRepository _tripRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetTripChecklistQueryHandler(
        IChecklistRepository checklistRepository,
        ITripRepository tripRepository,
        ICurrentUserService currentUserService)
    {
        _checklistRepository = checklistRepository;
        _tripRepository = tripRepository;
        _currentUserService = currentUserService;
    }

    public async Task<ChecklistSummaryDto?> Handle(
        GetTripChecklistQuery request,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUserService.UserId
            ?? throw new UnauthorizedException("User is not authenticated.");

        var trip = await _tripRepository.GetByIdAsync(request.TripId, currentUserId, cancellationToken);
        if (trip is null)
        {
            return null;
        }

        var categories = await _checklistRepository.GetCategoriesByTripIdAsync(request.TripId, cancellationToken);
        return categories.ToSummaryDto(request.TripId);
    }
}
