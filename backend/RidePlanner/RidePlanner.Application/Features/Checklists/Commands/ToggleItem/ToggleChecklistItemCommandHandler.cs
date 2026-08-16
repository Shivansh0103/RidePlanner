using MediatR;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Checklists.DTOs;
using RidePlanner.Application.Features.Checklists.Mappings;

namespace RidePlanner.Application.Features.Checklists.Commands.ToggleItem;

public sealed class ToggleChecklistItemCommandHandler : IRequestHandler<ToggleChecklistItemCommand, ChecklistSummaryDto?>
{
    private readonly IChecklistRepository _checklistRepository;

    public ToggleChecklistItemCommandHandler(IChecklistRepository checklistRepository)
    {
        _checklistRepository = checklistRepository;
    }

    public async Task<ChecklistSummaryDto?> Handle(
        ToggleChecklistItemCommand request,
        CancellationToken cancellationToken = default)
    {
        var item = await _checklistRepository.GetItemByIdAsync(request.ItemId, cancellationToken);
        if (item is null || item.Category.TripId != request.TripId)
        {
            return null;
        }

        if (request.IsCompleted.HasValue)
        {
            item.SetCompleted(request.IsCompleted.Value);
        }
        else
        {
            item.ToggleCompletion();
        }

        await _checklistRepository.SaveChangesAsync(cancellationToken);

        var updatedCategories = await _checklistRepository.GetCategoriesByTripIdAsync(request.TripId, cancellationToken);
        return updatedCategories.ToSummaryDto(request.TripId);
    }
}
