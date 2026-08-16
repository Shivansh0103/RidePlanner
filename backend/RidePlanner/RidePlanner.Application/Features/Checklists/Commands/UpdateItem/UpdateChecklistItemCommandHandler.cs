using MediatR;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Checklists.DTOs;
using RidePlanner.Application.Features.Checklists.Mappings;

namespace RidePlanner.Application.Features.Checklists.Commands.UpdateItem;

public sealed class UpdateChecklistItemCommandHandler : IRequestHandler<UpdateChecklistItemCommand, ChecklistSummaryDto?>
{
    private readonly IChecklistRepository _checklistRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateChecklistItemCommandHandler(
        IChecklistRepository checklistRepository,
        IUnitOfWork unitOfWork)
    {
        _checklistRepository = checklistRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ChecklistSummaryDto?> Handle(
        UpdateChecklistItemCommand request,
        CancellationToken cancellationToken = default)
    {
        var item = await _checklistRepository.GetItemByIdAsync(request.ItemId, cancellationToken);
        if (item is null || item.Category.TripId != request.TripId)
        {
            return null;
        }

        item.Update(request.Title, item.DisplayOrder, request.IsRequired);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var updatedCategories = await _checklistRepository.GetCategoriesByTripIdAsync(request.TripId, cancellationToken);
        return updatedCategories.ToSummaryDto(request.TripId);
    }
}
