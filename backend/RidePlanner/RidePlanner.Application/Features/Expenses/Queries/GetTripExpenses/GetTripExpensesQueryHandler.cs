using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Expenses.DTOs;
using RidePlanner.Application.Features.Expenses.Mappings;

namespace RidePlanner.Application.Features.Expenses.Queries.GetTripExpenses;

public sealed class GetTripExpensesQueryHandler
{
    private readonly ITripRepository _tripRepository;

    public GetTripExpensesQueryHandler(ITripRepository tripRepository)
    {
        _tripRepository = tripRepository;
    }

    public async Task<IReadOnlyList<ExpenseDto>?> Handle(
        GetTripExpensesQuery query,
        CancellationToken cancellationToken = default)
    {
        var trip = await _tripRepository.GetWithBudgetAsync(
            query.TripId,
            cancellationToken);

        if (trip is null)
        {
            return null;
        }

        return trip.Budget.Expenses
            .OrderByDescending(x => x.ExpenseDate)
            .ThenByDescending(x => x.CreatedAt)
            .Select(x => x.ToDto())
            .ToList();
    }
}
