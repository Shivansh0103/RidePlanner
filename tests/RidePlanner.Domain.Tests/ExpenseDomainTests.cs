using RidePlanner.Domain.Entities.Budget;
using RidePlanner.Domain.Enums;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Domain.Tests;

public class ExpenseDomainTests
{
    [Fact]
    public void Expense_Creation_Validates_Properties()
    {
        var tripBudgetId = Guid.NewGuid();
        var expenseDate = new DateOnly(2026, 8, 15);

        var expense = new Expense(
            tripBudgetId,
            BudgetCategoryType.Fuel,
            "IOCL Petrol",
            3500m,
            expenseDate,
            PaymentMethod.UPI,
            "Tank full at Highway fuel station");

        Assert.NotEqual(Guid.Empty, expense.Id);
        Assert.Equal(tripBudgetId, expense.TripBudgetId);
        Assert.Equal(BudgetCategoryType.Fuel, expense.Category);
        Assert.Equal("IOCL Petrol", expense.Title);
        Assert.Equal(3500m, expense.Amount);
        Assert.Equal(expenseDate, expense.ExpenseDate);
        Assert.Equal(PaymentMethod.UPI, expense.PaymentMethod);
        Assert.Equal("Tank full at Highway fuel station", expense.Notes);
        Assert.Null(expense.AccommodationId);
        Assert.Null(expense.TripStopId);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-50)]
    public void Expense_Creation_Throws_When_Amount_Is_Zero_Or_Negative(decimal amount)
    {
        var tripBudgetId = Guid.NewGuid();

        Assert.Throws<DomainException>(() =>
            new Expense(
                tripBudgetId,
                BudgetCategoryType.Food,
                "Lunch",
                amount,
                new DateOnly(2026, 8, 15)));
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null)]
    public void Expense_Creation_Throws_When_Title_Is_Empty(string? title)
    {
        var tripBudgetId = Guid.NewGuid();

        Assert.Throws<DomainException>(() =>
            new Expense(
                tripBudgetId,
                BudgetCategoryType.Food,
                title!,
                500m,
                new DateOnly(2026, 8, 15)));
    }

    [Fact]
    public void Expense_Creation_Throws_When_Title_Exceeds_200_Chars()
    {
        var tripBudgetId = Guid.NewGuid();
        var longTitle = new string('A', 201);

        Assert.Throws<DomainException>(() =>
            new Expense(
                tripBudgetId,
                BudgetCategoryType.Food,
                longTitle,
                500m,
                new DateOnly(2026, 8, 15)));
    }

    [Fact]
    public void Expense_Creation_Throws_When_Notes_Exceed_1000_Chars()
    {
        var tripBudgetId = Guid.NewGuid();
        var longNotes = new string('N', 1001);

        Assert.Throws<DomainException>(() =>
            new Expense(
                tripBudgetId,
                BudgetCategoryType.Food,
                "Dinner",
                500m,
                new DateOnly(2026, 8, 15),
                notes: longNotes));
    }

    [Fact]
    public void TripBudget_AddExpense_Updates_ActualCost_And_CategoryTotals()
    {
        var tripId = Guid.NewGuid();
        var budget = new TripBudget(tripId, 25000m);

        budget.AddEstimate(BudgetCategoryType.Fuel, "Fuel Estimate", 5000m);
        budget.AddEstimate(BudgetCategoryType.Accommodation, "Hotel Estimate", 10000m);

        Assert.Equal(15000m, budget.EstimatedCost);
        Assert.Equal(0m, budget.ActualCost);
        Assert.Equal(25000m, budget.RemainingTargetBuffer);
        Assert.Equal(-15000m, budget.Variance); // Actual (0) - Planned (15000)

        // Log actual expenses
        budget.AddExpense(BudgetCategoryType.Fuel, "Petrol Stop 1", 3000m, new DateOnly(2026, 8, 15), PaymentMethod.UPI);
        budget.AddExpense(BudgetCategoryType.Fuel, "Petrol Stop 2", 2500m, new DateOnly(2026, 8, 16), PaymentMethod.Cash);
        budget.AddExpense(BudgetCategoryType.Accommodation, "Hotel Payment", 11000m, new DateOnly(2026, 8, 16), PaymentMethod.CreditCard);

        Assert.Equal(16500m, budget.ActualCost);
        Assert.Equal(5500m, budget.GetCategoryActualTotal(BudgetCategoryType.Fuel));
        Assert.Equal(11000m, budget.GetCategoryActualTotal(BudgetCategoryType.Accommodation));
        Assert.Equal(0m, budget.GetCategoryActualTotal(BudgetCategoryType.Food));

        // Target: 25000 - Actual: 16500 = 8500 remaining target buffer
        Assert.Equal(8500m, budget.RemainingTargetBuffer);

        // Variance = Actual (16500) - Planned (15000) = +1500 (over planned amount by 1500)
        Assert.Equal(1500m, budget.Variance);

        // Category Variances
        Assert.Equal(500m, budget.GetCategoryVariance(BudgetCategoryType.Fuel)); // 5500 actual - 5000 planned = +500
        Assert.Equal(1000m, budget.GetCategoryVariance(BudgetCategoryType.Accommodation)); // 11000 actual - 10000 planned = +1000
    }

    [Fact]
    public void TripBudget_Update_And_Remove_Expense()
    {
        var tripId = Guid.NewGuid();
        var budget = new TripBudget(tripId, 20000m);

        var expense = budget.AddExpense(
            BudgetCategoryType.Food,
            "Highway Dhaba",
            1200m,
            new DateOnly(2026, 8, 15),
            PaymentMethod.Cash);

        Assert.Equal(1200m, budget.ActualCost);

        // Update expense
        bool updateSuccess = budget.UpdateExpense(
            expense.Id,
            BudgetCategoryType.Food,
            "Highway Dhaba (with snacks)",
            1500m,
            new DateOnly(2026, 8, 15),
            PaymentMethod.UPI);

        Assert.True(updateSuccess);
        Assert.Equal(1500m, budget.ActualCost);
        Assert.Equal("Highway Dhaba (with snacks)", budget.Expenses.First().Title);

        // Remove expense
        bool removeSuccess = budget.RemoveExpense(expense.Id);
        Assert.True(removeSuccess);
        Assert.Equal(0m, budget.ActualCost);
        Assert.Empty(budget.Expenses);
    }

    [Fact]
    public void Accommodation_Sync_Does_Not_Generate_Actual_Expenses()
    {
        var tripId = Guid.NewGuid();
        var budget = new TripBudget(tripId, 50000m);
        var accommodationId = Guid.NewGuid();

        // 1. Sync accommodation cost to budget
        budget.SyncAccommodationEstimate(accommodationId, "Luxury Manali Resort", 12000m);

        // 2. Verify estimate was updated, but expenses collection remains empty!
        Assert.Single(budget.Estimates);
        Assert.Equal(12000m, budget.EstimatedCost);
        Assert.Empty(budget.Expenses);
        Assert.Equal(0m, budget.ActualCost);

        // 3. Updating accommodation cost updates estimate only
        budget.SyncAccommodationEstimate(accommodationId, "Luxury Manali Resort", 14000m);
        Assert.Equal(14000m, budget.EstimatedCost);
        Assert.Empty(budget.Expenses);
        Assert.Equal(0m, budget.ActualCost);
    }
}
