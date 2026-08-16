using MediatR;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Checklists.DTOs;
using RidePlanner.Application.Features.Checklists.Mappings;

namespace RidePlanner.Application.Features.Checklists.Commands.DeleteItem;

public sealed class DeleteChecklistItemCommandHandler : IRequestHandler<DeleteChecklistItemCommand, ChecklistSummaryDto?>
{
    private readonly IChecklistRepository _checklistRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteChecklistItemCommandHandler(
        IChecklistRepository checklistRepository,
        IUnitOfWork unitOfWork)
    {
        _checklistRepository = checklistRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ChecklistSummaryDto?> Handle(
        DeleteChecklistItemCommand request,
        CancellationToken cancellationToken = default)
    {
        var item = await _checklistRepository.GetItemByIdAsync(request.ItemId, cancellationToken);
        if (item is null || item.Category.TripId != request.TripId)
        {
            return null;
        }

        _checklistRepository.RemoveItem(item);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var updatedCategories = await _checklistRepository.GetCategoriesByTripIdAsync(request.TripId, cancellationToken);
        return updatedCategories.ToSummaryDto(request.TripId);
    }
}
