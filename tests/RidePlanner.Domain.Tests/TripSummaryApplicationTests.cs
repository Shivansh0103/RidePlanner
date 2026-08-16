using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Summary.Queries.GetTripSummary;
using RidePlanner.Domain.Entities;
using RidePlanner.Domain.Entities.Budget;
using RidePlanner.Domain.Entities.Checklist;
using RidePlanner.Domain.Enums;

namespace RidePlanner.Domain.Tests;

public class TripSummaryApplicationTests
{
    private readonly FakeTripRepository _tripRepository = new();
    private readonly FakeTripStopRepository _stopRepository = new();
    private readonly FakeExpenseRepository _expenseRepository = new();
    private readonly FakeAccommodationRepository _accommodationRepository = new();
    private readonly FakeChecklistRepository _checklistRepository = new();

    [Fact]
    public async Task GetTripSummaryQueryHandler_Correctly_Calculates_TotalExpenses()
    {
        var trip = Trip.Create("Ladakh Ride", "Himalaya tour", new DateOnly(2026, 8, 1), new DateOnly(2026, 8, 15));
        trip.InitializeBudget();
        trip.Budget!.UpdateTargetBudget(50000m);

        var exp1 = trip.Budget.AddExpense(BudgetCategoryType.Fuel, "Fuel Stop 1", 3000m, new DateOnly(2026, 8, 2), PaymentMethod.UPI);
        var exp2 = trip.Budget.AddExpense(BudgetCategoryType.Food, "Dinner", 1500m, new DateOnly(2026, 8, 3), PaymentMethod.Cash);

        _tripRepository.Add(trip);
        _expenseRepository.Expenses.Add(exp1);
        _expenseRepository.Expenses.Add(exp2);

        var handler = new GetTripSummaryQueryHandler(
            _tripRepository,
            _stopRepository,
            _expenseRepository,
            _accommodationRepository,
            _checklistRepository);

        var query = new GetTripSummaryQuery(trip.Id);
        var summary = await handler.Handle(query, CancellationToken.None);

        Assert.NotNull(summary);
        Assert.Equal(4500m, summary.TotalExpenses);
        Assert.Equal(50000m, summary.TargetBudget);
        Assert.Equal(45500m, summary.BudgetVariance); // 50000 - 4500
    }

    private class FakeTripRepository : ITripRepository
    {
        public List<Trip> Trips { get; } = [];

        public void Add(Trip trip) => Trips.Add(trip);
        public Task<Trip?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) => Task.FromResult(Trips.FirstOrDefault(t => t.Id == id));
        public Task<Trip?> GetWithBudgetAsync(Guid id, CancellationToken cancellationToken = default) => Task.FromResult(Trips.FirstOrDefault(t => t.Id == id));
        public Task<IReadOnlyList<Trip>> GetAllAsync(CancellationToken cancellationToken = default) => Task.FromResult<IReadOnlyList<Trip>>(Trips);
        public Task DeleteAsync(Trip trip, CancellationToken cancellationToken = default) { Trips.Remove(trip); return Task.CompletedTask; }
    }

    private class FakeTripStopRepository : ITripStopRepository
    {
        public Task<IReadOnlyList<TripStop>> GetByTripIdAsync(Guid tripId, CancellationToken cancellationToken = default) => Task.FromResult<IReadOnlyList<TripStop>>([]);
        public Task<TripStop?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) => Task.FromResult<TripStop?>(null);
        public void Add(TripStop tripStop) { }
        public void Remove(TripStop tripStop) { }
        public Task ReorderAsync(Guid tripId, IReadOnlyList<Guid> orderedStopIds, CancellationToken cancellationToken = default) => Task.CompletedTask;
    }

    private class FakeExpenseRepository : IExpenseRepository
    {
        public List<Expense> Expenses { get; } = [];
        public Task<Expense?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) => Task.FromResult(Expenses.FirstOrDefault(e => e.Id == id));
        public Task<IReadOnlyList<Expense>> GetByTripBudgetIdAsync(Guid tripBudgetId, CancellationToken cancellationToken = default)
            => Task.FromResult<IReadOnlyList<Expense>>(Expenses.Where(e => e.TripBudgetId == tripBudgetId).ToList());
        public void Add(Expense expense) => Expenses.Add(expense);
        public void Remove(Expense expense) => Expenses.Remove(expense);
    }

    private class FakeAccommodationRepository : IAccommodationRepository
    {
        public Task<IReadOnlyList<Accommodation>> GetByTripIdAsync(Guid tripId, CancellationToken cancellationToken = default) => Task.FromResult<IReadOnlyList<Accommodation>>([]);
        public Task<Accommodation?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) => Task.FromResult<Accommodation?>(null);
        public Task<Accommodation?> GetWithDetailsByIdAsync(Guid id, CancellationToken cancellationToken = default) => Task.FromResult<Accommodation?>(null);
        public void Add(Accommodation accommodation) { }
        public void Remove(Accommodation accommodation) { }
    }

    private class FakeChecklistRepository : IChecklistRepository
    {
        public Task<IReadOnlyList<ChecklistCategory>> GetCategoriesByTripIdAsync(Guid tripId, CancellationToken cancellationToken = default) => Task.FromResult<IReadOnlyList<ChecklistCategory>>([]);
        public Task<ChecklistCategory?> GetCategoryByIdAsync(Guid categoryId, CancellationToken cancellationToken = default) => Task.FromResult<ChecklistCategory?>(null);
        public Task<ChecklistItem?> GetItemByIdAsync(Guid itemId, CancellationToken cancellationToken = default) => Task.FromResult<ChecklistItem?>(null);
        public void AddCategory(ChecklistCategory category) { }
        public void RemoveCategory(ChecklistCategory category) { }
        public void AddItem(ChecklistItem item) { }
        public void RemoveItem(ChecklistItem item) { }
    }
}
