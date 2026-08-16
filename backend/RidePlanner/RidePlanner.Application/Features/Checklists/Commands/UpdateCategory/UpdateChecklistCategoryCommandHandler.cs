using MediatR;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Checklists.DTOs;
using RidePlanner.Application.Features.Checklists.Mappings;

namespace RidePlanner.Application.Features.Checklists.Commands.UpdateCategory;

public sealed class UpdateChecklistCategoryCommandHandler : IRequestHandler<UpdateChecklistCategoryCommand, ChecklistSummaryDto?>
{
    private readonly IChecklistRepository _checklistRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateChecklistCategoryCommandHandler(
        IChecklistRepository checklistRepository,
        IUnitOfWork unitOfWork)
    {
        _checklistRepository = checklistRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ChecklistSummaryDto?> Handle(
        UpdateChecklistCategoryCommand request,
        CancellationToken cancellationToken = default)
    {
        var category = await _checklistRepository.GetCategoryByIdAsync(request.CategoryId, cancellationToken);
        if (category is null || category.TripId != request.TripId)
        {
            return null;
        }

        category.Update(request.Name, category.DisplayOrder);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var updatedCategories = await _checklistRepository.GetCategoriesByTripIdAsync(request.TripId, cancellationToken);
        return updatedCategories.ToSummaryDto(request.TripId);
    }
}
