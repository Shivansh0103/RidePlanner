using RidePlanner.Domain.Entities.Budget;

namespace RidePlanner.Application.Abstractions.Persistence;

public interface IExpenseRepository
{
    Task<Expense?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Expense>> GetByTripBudgetIdAsync(
        Guid tripBudgetId,
        CancellationToken cancellationToken = default);

    void Add(Expense expense);

    void Remove(Expense expense);

    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
