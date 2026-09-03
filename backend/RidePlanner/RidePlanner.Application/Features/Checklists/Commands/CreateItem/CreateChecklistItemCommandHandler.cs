using MediatR;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Checklists.DTOs;
using RidePlanner.Application.Features.Checklists.Mappings;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.Checklists.Commands.CreateItem;

public sealed class CreateChecklistItemCommandHandler : IRequestHandler<CreateChecklistItemCommand, ChecklistSummaryDto?>
{
    private readonly ITripRepository _tripRepository;
    private readonly IChecklistRepository _checklistRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;

    public CreateChecklistItemCommandHandler(
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
        CreateChecklistItemCommand request,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUserService.UserId
            ?? throw new UnauthorizedException("User is not authenticated.");

        var trip = await _tripRepository.GetByIdAsync(request.TripId, currentUserId, cancellationToken);
        if (trip is null)
        {
            return null;
        }

        var category = await _checklistRepository.GetCategoryByIdAsync(request.CategoryId, cancellationToken);
        if (category is null || category.TripId != request.TripId)
        {
            return null;
        }

        var nextDisplayOrder = category.Items.Count > 0
            ? category.Items.Max(i => i.DisplayOrder) + 1
            : 1;

        var item = category.AddItem(request.Title, nextDisplayOrder, isRequired: request.IsRequired);
        _checklistRepository.AddItem(item);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var updatedCategories = await _checklistRepository.GetCategoriesByTripIdAsync(request.TripId, cancellationToken);
        return updatedCategories.ToSummaryDto(request.TripId);
    }
}
