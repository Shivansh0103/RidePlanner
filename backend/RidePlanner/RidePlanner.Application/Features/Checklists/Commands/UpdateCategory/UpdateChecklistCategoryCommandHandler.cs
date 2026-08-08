using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Checklists.DTOs;
using RidePlanner.Application.Features.Checklists.Mappings;

namespace RidePlanner.Application.Features.Checklists.Commands.UpdateCategory;

public sealed class UpdateChecklistCategoryCommandHandler
{
    private readonly IChecklistRepository _checklistRepository;

    public UpdateChecklistCategoryCommandHandler(IChecklistRepository checklistRepository)
    {
        _checklistRepository = checklistRepository;
    }

    public async Task<ChecklistSummaryDto?> Handle(
        UpdateChecklistCategoryCommand command,
        CancellationToken cancellationToken = default)
    {
        var category = await _checklistRepository.GetCategoryByIdAsync(command.CategoryId, cancellationToken);
        if (category is null || category.TripId != command.TripId)
        {
            return null;
        }

        category.Update(command.Name, category.DisplayOrder);
        await _checklistRepository.SaveChangesAsync(cancellationToken);

        var updatedCategories = await _checklistRepository.GetCategoriesByTripIdAsync(command.TripId, cancellationToken);
        return updatedCategories.ToSummaryDto(command.TripId);
    }
}
