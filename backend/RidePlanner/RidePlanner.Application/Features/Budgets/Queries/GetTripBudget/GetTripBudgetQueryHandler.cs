using MediatR;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Budgets.DTOs;
using RidePlanner.Application.Features.Budgets.Mapping;

namespace RidePlanner.Application.Features.Budgets.Queries.GetTripBudget;

public sealed class GetTripBudgetQueryHandler : IRequestHandler<GetTripBudgetQuery, TripBudgetDto?>
{
    private readonly ITripRepository _tripRepository;

    public GetTripBudgetQueryHandler(ITripRepository tripRepository)
    {
        _tripRepository = tripRepository;
    }

    public async Task<TripBudgetDto?> Handle(
        GetTripBudgetQuery request,
        CancellationToken cancellationToken = default)
    {
        var trip = await _tripRepository.GetWithBudgetAsync(
            request.TripId,
            cancellationToken);

        if (trip is null)
        {
            return null;
        }

        return trip.Budget.ToDto();
    }
}