using MediatR;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Checklists.DTOs;
using RidePlanner.Application.Features.Checklists.Mappings;
using RidePlanner.Domain.Entities.Checklist;

namespace RidePlanner.Application.Features.Checklists.Commands.CreateCategory;

public sealed class CreateChecklistCategoryCommandHandler : IRequestHandler<CreateChecklistCategoryCommand, ChecklistSummaryDto?>
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
        CreateChecklistCategoryCommand request,
        CancellationToken cancellationToken = default)
    {
        var trip = await _tripRepository.GetByIdAsync(request.TripId, cancellationToken);
        if (trip is null)
        {
            return null;
        }

        var existingCategories = await _checklistRepository.GetCategoriesByTripIdAsync(request.TripId, cancellationToken);
        var nextDisplayOrder = existingCategories.Count > 0
            ? existingCategories.Max(c => c.DisplayOrder) + 1
            : 1;

        var category = new ChecklistCategory(request.TripId, request.Name, nextDisplayOrder);
        _checklistRepository.AddCategory(category);
        await _checklistRepository.SaveChangesAsync(cancellationToken);

        var updatedCategories = await _checklistRepository.GetCategoriesByTripIdAsync(request.TripId, cancellationToken);
        return updatedCategories.ToSummaryDto(request.TripId);
    }
}
