using MediatR;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Budgets.DTOs;
using RidePlanner.Application.Features.Budgets.Mapping;

namespace RidePlanner.Application.Features.Budgets.Commands.DeleteBudgetEstimate;

public sealed class DeleteBudgetEstimateCommandHandler : IRequestHandler<DeleteBudgetEstimateCommand, TripBudgetDto?>
{
    private readonly ITripRepository _tripRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteBudgetEstimateCommandHandler(
        ITripRepository tripRepository,
        IUnitOfWork unitOfWork)
    {
        _tripRepository = tripRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<TripBudgetDto?> Handle(
        DeleteBudgetEstimateCommand request,
        CancellationToken cancellationToken = default)
    {
        var trip = await _tripRepository.GetWithBudgetAsync(
            request.TripId,
            cancellationToken);

        if (trip is null || trip.Budget is null)
        {
            return null;
        }

        var removed = trip.Budget.RemoveEstimate(request.EstimateId);
        if (!removed)
        {
            return null;
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return trip.Budget.ToDto();
    }
}
