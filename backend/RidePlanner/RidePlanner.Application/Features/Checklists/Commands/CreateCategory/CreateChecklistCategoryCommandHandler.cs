using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Checklists.DTOs;
using RidePlanner.Application.Features.Checklists.Mappings;
using RidePlanner.Domain.Entities.Checklist;

namespace RidePlanner.Application.Features.Checklists.Commands.CreateCategory;

public sealed class CreateChecklistCategoryCommandHandler
{
    private readonly IChecklistRepository _checklistRepository;
    private readonly ITripRepository _tripRepository;

    public CreateChecklistCategoryCommandHandler(
        IChecklistRepository checklistRepository,
        ITripRepository tripRepository)
    {
        _checklistRepository = checklistRepository;
        _tripRepository = tripRepository;
    }

    public async Task<ChecklistSummaryDto?> Handle(
        CreateChecklistCategoryCommand command,
        CancellationToken cancellationToken = default)
    {
        var trip = await _tripRepository.GetByIdAsync(command.TripId, cancellationToken);
        if (trip is null)
        {
            return null;
        }

        var existingCategories = await _checklistRepository.GetCategoriesByTripIdAsync(command.TripId, cancellationToken);
        var nextDisplayOrder = existingCategories.Count > 0
            ? existingCategories.Max(c => c.DisplayOrder) + 1
            : 1;

        var category = new ChecklistCategory(command.TripId, command.Name, nextDisplayOrder);
        _checklistRepository.AddCategory(category);
        await _checklistRepository.SaveChangesAsync(cancellationToken);

        var updatedCategories = await _checklistRepository.GetCategoriesByTripIdAsync(command.TripId, cancellationToken);
        return updatedCategories.ToSummaryDto(command.TripId);
    }
}
