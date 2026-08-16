using MediatR;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Budgets.DTOs;
using RidePlanner.Application.Features.Budgets.Mapping;

namespace RidePlanner.Application.Features.Budgets.Commands.UpdateTripBudget;

public sealed class UpdateTripBudgetCommandHandler : IRequestHandler<UpdateTripBudgetCommand, TripBudgetDto?>
{
    private readonly ITripRepository _tripRepository;

    public UpdateTripBudgetCommandHandler(ITripRepository tripRepository)
    {
        _tripRepository = tripRepository;
    }

    public async Task<TripBudgetDto?> Handle(
        UpdateTripBudgetCommand request,
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

        trip.Budget.UpdateTargetBudget(request.TargetBudget);

        await _tripRepository.SaveChangesAsync(cancellationToken);

        return trip.Budget.ToDto();
    }
}