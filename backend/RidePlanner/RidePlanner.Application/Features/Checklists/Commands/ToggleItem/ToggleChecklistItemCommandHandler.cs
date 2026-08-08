using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Checklists.DTOs;
using RidePlanner.Application.Features.Checklists.Mappings;

namespace RidePlanner.Application.Features.Checklists.Commands.ToggleItem;

public sealed class ToggleChecklistItemCommandHandler
{
    private readonly IChecklistRepository _checklistRepository;

    public ToggleChecklistItemCommandHandler(IChecklistRepository checklistRepository)
    {
        _checklistRepository = checklistRepository;
    }

    public async Task<ChecklistSummaryDto?> Handle(
        ToggleChecklistItemCommand command,
        CancellationToken cancellationToken = default)
    {
        var item = await _checklistRepository.GetItemByIdAsync(command.ItemId, cancellationToken);
        if (item is null || item.Category.TripId != command.TripId)
        {
            return null;
        }

        if (command.IsCompleted.HasValue)
        {
            item.SetCompleted(command.IsCompleted.Value);
        }
        else
        {
            item.ToggleCompletion();
        }

        await _checklistRepository.SaveChangesAsync(cancellationToken);

        var updatedCategories = await _checklistRepository.GetCategoriesByTripIdAsync(command.TripId, cancellationToken);
        return updatedCategories.ToSummaryDto(command.TripId);
    }
}
