using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Budgets.DTOs;
using RidePlanner.Application.Features.Budgets.Mapping;

namespace RidePlanner.Application.Features.Budgets.Commands.UpdateBudgetEstimate;

public sealed class UpdateBudgetEstimateCommandHandler
{
    private readonly ITripRepository _tripRepository;

    public UpdateBudgetEstimateCommandHandler(ITripRepository tripRepository)
    {
        _tripRepository = tripRepository;
    }

    public async Task<TripBudgetDto?> Handle(
        UpdateBudgetEstimateCommand command,
        CancellationToken cancellationToken = default)
    {
        var trip = await _tripRepository.GetWithBudgetAsync(
            command.TripId,
            cancellationToken);

        if (trip is null || trip.Budget is null)
        {
            return null;
        }

        var updated = trip.Budget.UpdateEstimate(
            command.EstimateId,
            command.Name,
            command.EstimatedAmount);

        if (!updated)
        {
            return null;
        }

        await _tripRepository.SaveChangesAsync(cancellationToken);

        return trip.Budget.ToDto();
    }
}
