using MediatR;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Checklists.DTOs;
using RidePlanner.Application.Features.Checklists.Mappings;

namespace RidePlanner.Application.Features.Checklists.Commands.CreateItem;

public sealed class CreateChecklistItemCommandHandler : IRequestHandler<CreateChecklistItemCommand, ChecklistSummaryDto?>
{
    private readonly IChecklistRepository _checklistRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateChecklistItemCommandHandler(
        IChecklistRepository checklistRepository,
        IUnitOfWork unitOfWork)
    {
        _checklistRepository = checklistRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ChecklistSummaryDto?> Handle(
        CreateChecklistItemCommand request,
        CancellationToken cancellationToken = default)
    {
        var category = await _checklistRepository.GetCategoryByIdAsync(request.CategoryId, cancellationToken);
        if (category is null || category.TripId != request.TripId)
        {
            return null;
        }

        var nextDisplayOrder = category.Items.Count > 0
            ? category.Items.Max(i => i.DisplayOrder) + 1
            : 1;

        category.AddItem(request.Title, nextDisplayOrder, isRequired: request.IsRequired);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var updatedCategories = await _checklistRepository.GetCategoriesByTripIdAsync(request.TripId, cancellationToken);
        return updatedCategories.ToSummaryDto(request.TripId);
    }
}
