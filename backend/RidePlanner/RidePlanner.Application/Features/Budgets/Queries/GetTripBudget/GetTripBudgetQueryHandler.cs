using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Common.Exceptions;
using RidePlanner.Application.Features.Budgets.DTOs;
using RidePlanner.Application.Features.Budgets.Mapping;
using RidePlanner.Domain.Entities;

namespace RidePlanner.Application.Features.Budgets.Queries.GetTripBudget;

public sealed class GetTripBudgetQueryHandler
{
    private readonly ITripRepository _tripRepository;

    public GetTripBudgetQueryHandler(ITripRepository tripRepository)
    {
        _tripRepository = tripRepository;
    }

    public async Task<TripBudgetDto?> Handle(
    GetTripBudgetQuery query,
    CancellationToken cancellationToken = default)
    {
        var trip = await _tripRepository.GetWithBudgetAsync(
            query.TripId,
            cancellationToken);

        if (trip is null)
        {
            return null;
        }

        return trip.Budget.ToDto();
    }
}