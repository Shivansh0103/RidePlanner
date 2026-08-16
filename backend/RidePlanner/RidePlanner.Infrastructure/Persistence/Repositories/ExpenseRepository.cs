using Microsoft.EntityFrameworkCore;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Entities.Budget;

namespace RidePlanner.Infrastructure.Persistence.Repositories;

public sealed class ExpenseRepository : IExpenseRepository
{
    private readonly RidePlannerDbContext _dbContext;

    public ExpenseRepository(RidePlannerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Expense?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Expenses
            .Include(e => e.Accommodation)
            .Include(e => e.TripStop)
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
    }

    public async Task<IReadOnlyList<Expense>> GetByTripBudgetIdAsync(
        Guid tripBudgetId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Expenses
            .AsNoTracking()
            .Include(e => e.Accommodation)
            .Include(e => e.TripStop)
            .Where(e => e.TripBudgetId == tripBudgetId)
            .OrderByDescending(e => e.ExpenseDate)
            .ThenByDescending(e => e.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public void Add(Expense expense)
    {
        _dbContext.Expenses.Add(expense);
    }

    public void Remove(Expense expense)
    {
        _dbContext.Expenses.Remove(expense);
    }
}
