using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Checklists.DTOs;
using RidePlanner.Application.Features.Checklists.Mappings;

namespace RidePlanner.Application.Features.Checklists.Commands.CreateItem;

public sealed class CreateChecklistItemCommandHandler
{
    private readonly IChecklistRepository _checklistRepository;

    public CreateChecklistItemCommandHandler(IChecklistRepository checklistRepository)
    {
        _checklistRepository = checklistRepository;
    }

    public async Task<ChecklistSummaryDto?> Handle(
        CreateChecklistItemCommand command,
        CancellationToken cancellationToken = default)
    {
        var category = await _checklistRepository.GetCategoryByIdAsync(command.CategoryId, cancellationToken);
        if (category is null || category.TripId != command.TripId)
        {
            return null;
        }

        var nextDisplayOrder = category.Items.Count > 0
            ? category.Items.Max(i => i.DisplayOrder) + 1
            : 1;

        category.AddItem(command.Title, nextDisplayOrder);
        await _checklistRepository.SaveChangesAsync(cancellationToken);

        var updatedCategories = await _checklistRepository.GetCategoriesByTripIdAsync(command.TripId, cancellationToken);
        return updatedCategories.ToSummaryDto(command.TripId);
    }
}
