using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Checklists.DTOs;
using RidePlanner.Application.Features.Checklists.Mappings;

namespace RidePlanner.Application.Features.Checklists.Queries.GetTripChecklist;

public sealed class GetTripChecklistQueryHandler
{
    private readonly IChecklistRepository _checklistRepository;
    private readonly ITripRepository _tripRepository;

    public GetTripChecklistQueryHandler(
        IChecklistRepository checklistRepository,
        ITripRepository tripRepository)
    {
        _checklistRepository = checklistRepository;
        _tripRepository = tripRepository;
    }

    public async Task<ChecklistSummaryDto?> Handle(
        GetTripChecklistQuery query,
        CancellationToken cancellationToken = default)
    {
        var trip = await _tripRepository.GetByIdAsync(query.TripId, cancellationToken);
        if (trip is null)
        {
            return null;
        }

        var categories = await _checklistRepository.GetCategoriesByTripIdAsync(query.TripId, cancellationToken);
        return categories.ToSummaryDto(query.TripId);
    }
}
