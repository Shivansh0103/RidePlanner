using MediatR;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Budgets.DTOs;
using RidePlanner.Application.Features.Budgets.Mapping;

namespace RidePlanner.Application.Features.Budgets.Commands.CreateBudgetEstimate;

public sealed class CreateBudgetEstimateCommandHandler : IRequestHandler<CreateBudgetEstimateCommand, TripBudgetDto?>
{
    private readonly ITripRepository _tripRepository;

    public CreateBudgetEstimateCommandHandler(ITripRepository tripRepository)
    {
        _tripRepository = tripRepository;
    }

    public async Task<TripBudgetDto?> Handle(
        CreateBudgetEstimateCommand request,
        CancellationToken cancellationToken = default)
    {
        var trip = await _tripRepository.GetWithBudgetAsync(
            request.TripId,
            cancellationToken);

        if (trip is null)
        {
            return null;
        }

        trip.InitializeBudget();

        trip.Budget.AddEstimate(
            request.Category,
            request.Name,
            request.EstimatedAmount);

        await _tripRepository.SaveChangesAsync(cancellationToken);

        return trip.Budget.ToDto();
    }
}
