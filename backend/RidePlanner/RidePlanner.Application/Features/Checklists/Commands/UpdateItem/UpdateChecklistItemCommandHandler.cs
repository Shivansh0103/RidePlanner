using MediatR;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Checklists.DTOs;
using RidePlanner.Application.Features.Checklists.Mappings;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.Checklists.Commands.UpdateItem;

public sealed class UpdateChecklistItemCommandHandler : IRequestHandler<UpdateChecklistItemCommand, ChecklistSummaryDto?>
{
    private readonly ITripRepository _tripRepository;
    private readonly IChecklistRepository _checklistRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;

    public UpdateChecklistItemCommandHandler(
        ITripRepository tripRepository,
        IChecklistRepository checklistRepository,
        IUnitOfWork unitOfWork,
        ICurrentUserService currentUserService)
    {
        _tripRepository = tripRepository;
        _checklistRepository = checklistRepository;
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
    }

    public async Task<ChecklistSummaryDto?> Handle(
        UpdateChecklistItemCommand request,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUserService.UserId
            ?? throw new UnauthorizedException("User is not authenticated.");

        var trip = await _tripRepository.GetByIdAsync(request.TripId, currentUserId, cancellationToken);
        if (trip is null)
        {
            return null;
        }

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
