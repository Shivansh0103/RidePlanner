using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Expenses.Commands.CreateExpense;
using RidePlanner.Application.Features.Expenses.Commands.DeleteExpense;
using RidePlanner.Application.Features.Expenses.Commands.UpdateExpense;
using RidePlanner.Application.Features.Expenses.Queries.GetTripExpenses;
using RidePlanner.Domain.Entities;
using RidePlanner.Domain.Enums;

namespace RidePlanner.Domain.Tests;

public class ExpenseApplicationTests
{
    private class FakeTripRepository : ITripRepository
    {
        public List<Trip> Trips { get; } = [];

        public void Add(Trip trip) => Trips.Add(trip);

        public Task<Trip?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
            Task.FromResult(Trips.FirstOrDefault(t => t.Id == id));

        public Task<Trip?> GetWithBudgetAsync(Guid id, CancellationToken cancellationToken = default) =>
            Task.FromResult(Trips.FirstOrDefault(t => t.Id == id));

        public Task<IReadOnlyList<Trip>> GetAllAsync(CancellationToken cancellationToken = default) =>
            Task.FromResult<IReadOnlyList<Trip>>(Trips.AsReadOnly());

        public Task DeleteAsync(Trip trip, CancellationToken cancellationToken = default)
        {
            Trips.Remove(trip);
            return Task.CompletedTask;
        }
    }

    private class FakeUnitOfWork : IUnitOfWork
    {
        public bool SaveChangesCalled { get; private set; }

        public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            SaveChangesCalled = true;
            return Task.FromResult(1);
        }
    }

    [Fact]
    public async Task CreateExpenseCommandHandler_Creates_Expense_And_Returns_Dto()
    {
        var repository = new FakeTripRepository();
        var unitOfWork = new FakeUnitOfWork();
        var trip = Trip.Create("Leh Ladakh Ride", "Mountain trip", new DateOnly(2026, 8, 1), new DateOnly(2026, 8, 15));
        trip.InitializeBudget();
        repository.Add(trip);

        var handler = new CreateExpenseCommandHandler(repository, unitOfWork);

        var command = new CreateExpenseCommand(
            trip.Id,
            BudgetCategoryType.Fuel,
            "Manali IOCL Petrol",
            2800m,
            new DateOnly(2026, 8, 5),
            PaymentMethod.UPI,
            "Full tank petrol");

        var result = await handler.Handle(command, CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal("Manali IOCL Petrol", result.Title);
        Assert.Equal(2800m, result.Amount);
        Assert.Equal(BudgetCategoryType.Fuel, result.Category);
        Assert.Equal(PaymentMethod.UPI, result.PaymentMethod);
        Assert.True(unitOfWork.SaveChangesCalled);
    }

    [Fact]
    public async Task UpdateExpenseCommandHandler_Updates_Existing_Expense()
    {
        var repository = new FakeTripRepository();
        var unitOfWork = new FakeUnitOfWork();
        var trip = Trip.Create("Goa Ride", "Beach road trip", new DateOnly(2026, 9, 1), new DateOnly(2026, 9, 5));
        trip.InitializeBudget();

        var existingExpense = trip.Budget.AddExpense(
            BudgetCategoryType.Food,
            "Beach Shack Lunch",
            1500m,
            new DateOnly(2026, 9, 2),
            PaymentMethod.Cash);

        repository.Add(trip);

        var handler = new UpdateExpenseCommandHandler(repository, unitOfWork);

        var command = new UpdateExpenseCommand(
            trip.Id,
            existingExpense.Id,
            BudgetCategoryType.Food,
            "Beach Shack Seafood Dinner",
            2200m,
            new DateOnly(2026, 9, 2),
            PaymentMethod.CreditCard,
            "Upgraded meal");

        var result = await handler.Handle(command, CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal("Beach Shack Seafood Dinner", result.Title);
        Assert.Equal(2200m, result.Amount);
        Assert.Equal(PaymentMethod.CreditCard, result.PaymentMethod);
        Assert.True(unitOfWork.SaveChangesCalled);
    }

    [Fact]
    public async Task DeleteExpenseCommandHandler_Removes_Expense()
    {
        var repository = new FakeTripRepository();
        var unitOfWork = new FakeUnitOfWork();
        var trip = Trip.Create("South Tour", "Coastal trip", new DateOnly(2026, 10, 1), new DateOnly(2026, 10, 10));
        trip.InitializeBudget();

        var expense = trip.Budget.AddExpense(
            BudgetCategoryType.TollsAndPermits,
            "Highway Toll Plaza",
            350m,
            new DateOnly(2026, 10, 2),
            PaymentMethod.UPI);

        repository.Add(trip);

        var handler = new DeleteExpenseCommandHandler(repository, unitOfWork);
        var command = new DeleteExpenseCommand(trip.Id, expense.Id);

        var result = await handler.Handle(command, CancellationToken.None);

        Assert.NotNull(result);
        Assert.True(result);
        Assert.Empty(trip.Budget.Expenses);
        Assert.True(unitOfWork.SaveChangesCalled);
    }

    [Fact]
    public async Task GetTripExpensesQueryHandler_Returns_Expense_List()
    {
        var repository = new FakeTripRepository();
        var trip = Trip.Create("Spiti Valley", "Himalaya circuit", new DateOnly(2026, 7, 1), new DateOnly(2026, 7, 10));
        trip.InitializeBudget();

        trip.Budget.AddExpense(BudgetCategoryType.Fuel, "Kaza Petrol Station", 1800m, new DateOnly(2026, 7, 3), PaymentMethod.Cash);
        trip.Budget.AddExpense(BudgetCategoryType.Food, "Homestay Dinner", 800m, new DateOnly(2026, 7, 4), PaymentMethod.Cash);

        repository.Add(trip);

        var handler = new GetTripExpensesQueryHandler(repository);
        var query = new GetTripExpensesQuery(trip.Id);

        var result = await handler.Handle(query, CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal(2, result.Count);
        Assert.Contains(result, e => e.Title == "Kaza Petrol Station" && e.Amount == 1800m);
        Assert.Contains(result, e => e.Title == "Homestay Dinner" && e.Amount == 800m);
    }
}
