using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Checklists.DTOs;
using RidePlanner.Application.Features.Checklists.Mappings;

namespace RidePlanner.Application.Features.Checklists.Commands.UpdateItem;

public sealed class UpdateChecklistItemCommandHandler
{
    private readonly IChecklistRepository _checklistRepository;

    public UpdateChecklistItemCommandHandler(IChecklistRepository checklistRepository)
    {
        _checklistRepository = checklistRepository;
    }

    public async Task<ChecklistSummaryDto?> Handle(
        UpdateChecklistItemCommand command,
        CancellationToken cancellationToken = default)
    {
        var item = await _checklistRepository.GetItemByIdAsync(command.ItemId, cancellationToken);
        if (item is null || item.Category.TripId != command.TripId)
        {
            return null;
        }

        item.Update(command.Title, item.DisplayOrder);
        await _checklistRepository.SaveChangesAsync(cancellationToken);

        var updatedCategories = await _checklistRepository.GetCategoriesByTripIdAsync(command.TripId, cancellationToken);
        return updatedCategories.ToSummaryDto(command.TripId);
    }
}
