using MediatR;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Budgets.DTOs;
using RidePlanner.Application.Features.Budgets.Mapping;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.Budgets.Commands.UpdateBudgetEstimate;

public sealed class UpdateBudgetEstimateCommandHandler : IRequestHandler<UpdateBudgetEstimateCommand, TripBudgetDto?>
{
    private readonly ITripRepository _tripRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;

    public UpdateBudgetEstimateCommandHandler(
        ITripRepository tripRepository,
        IUnitOfWork unitOfWork,
        ICurrentUserService currentUserService)
    {
        _tripRepository = tripRepository;
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
    }

    public async Task<TripBudgetDto?> Handle(
        UpdateBudgetEstimateCommand request,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUserService.UserId
            ?? throw new UnauthorizedException("User is not authenticated.");

        var trip = await _tripRepository.GetWithBudgetAsync(
            request.TripId,
            currentUserId,
            cancellationToken);

        if (trip is null || trip.Budget is null)
        {
            return null;
        }

        var updated = trip.Budget.UpdateEstimate(
            request.EstimateId,
            request.Name,
            request.EstimatedAmount);

        if (!updated)
        {
            return null;
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return trip.Budget.ToDto();
    }
}
