using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Budgets.DTOs;
using RidePlanner.Application.Features.Budgets.Mapping;

namespace RidePlanner.Application.Features.Budgets.Commands.CreateBudgetEstimate;

public sealed class CreateBudgetEstimateCommandHandler
{
    private readonly ITripRepository _tripRepository;

    public CreateBudgetEstimateCommandHandler(ITripRepository tripRepository)
    {
        _tripRepository = tripRepository;
    }

    public async Task<TripBudgetDto?> Handle(
        CreateBudgetEstimateCommand command,
        CancellationToken cancellationToken = default)
    {
        var trip = await _tripRepository.GetWithBudgetAsync(
            command.TripId,
            cancellationToken);

        if (trip is null)
        {
            return null;
        }

        trip.InitializeBudget();

        trip.Budget.AddEstimate(
            command.Category,
            command.Name,
            command.EstimatedAmount);

        await _tripRepository.SaveChangesAsync(cancellationToken);

        return trip.Budget.ToDto();
    }
}
