using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Checklists.DTOs;
using RidePlanner.Application.Features.Checklists.Mappings;

namespace RidePlanner.Application.Features.Checklists.Commands.DeleteCategory;

public sealed class DeleteChecklistCategoryCommandHandler
{
    private readonly IChecklistRepository _checklistRepository;

    public DeleteChecklistCategoryCommandHandler(IChecklistRepository checklistRepository)
    {
        _checklistRepository = checklistRepository;
    }

    public async Task<ChecklistSummaryDto?> Handle(
        DeleteChecklistCategoryCommand command,
        CancellationToken cancellationToken = default)
    {
        var category = await _checklistRepository.GetCategoryByIdAsync(command.CategoryId, cancellationToken);
        if (category is null || category.TripId != command.TripId)
        {
            return null;
        }

        _checklistRepository.RemoveCategory(category);
        await _checklistRepository.SaveChangesAsync(cancellationToken);

        var updatedCategories = await _checklistRepository.GetCategoriesByTripIdAsync(command.TripId, cancellationToken);
        return updatedCategories.ToSummaryDto(command.TripId);
    }
}
