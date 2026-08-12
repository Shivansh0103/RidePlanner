using RidePlanner.Domain.Enums;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Domain.Entities.Budget;

public class TripBudget
{
    private readonly List<BudgetEstimate> _estimates = [];
    private readonly List<Expense> _expenses = [];

    private TripBudget()
    {
    }

    // Used when creating a new Trip
    public TripBudget(Guid tripId)
        : this(tripId, 0m)
    {
    }

    // Used when the target budget is explicitly known
    public TripBudget(Guid tripId, decimal targetBudget)
    {
        if (targetBudget < 0)
            throw new ArgumentOutOfRangeException(nameof(targetBudget));

        Id = Guid.NewGuid();
        TripId = tripId;
        TargetBudget = targetBudget;
    }

    public Guid Id { get; private set; }

    public Guid TripId { get; private set; }

    public decimal TargetBudget { get; private set; }

    public IReadOnlyCollection<BudgetEstimate> Estimates =>
        _estimates.AsReadOnly();

    public IReadOnlyCollection<Expense> Expenses =>
        _expenses.AsReadOnly();

    public Trip Trip { get; private set; } = null!;

    public decimal EstimatedCost =>
        _estimates.Sum(x => x.EstimatedAmount);

    public decimal ActualCost =>
        _expenses.Sum(x => x.Amount);

    public decimal RemainingBuffer =>
        TargetBudget - EstimatedCost;

    public decimal RemainingTargetBuffer =>
        TargetBudget - ActualCost;

    public decimal Variance =>
        ActualCost - EstimatedCost;

    public decimal GetCategoryTotal(BudgetCategoryType category)
    {
        return _estimates
            .Where(x => x.Category == category)
            .Sum(x => x.EstimatedAmount);
    }

    public decimal GetCategoryActualTotal(BudgetCategoryType category)
    {
        return _expenses
            .Where(x => x.Category == category)
            .Sum(x => x.Amount);
    }

    public decimal GetCategoryVariance(BudgetCategoryType category)
    {
        return GetCategoryActualTotal(category) - GetCategoryTotal(category);
    }

    public void UpdateTargetBudget(decimal targetBudget)
    {
        if (targetBudget < 0)
            throw new ArgumentOutOfRangeException(nameof(targetBudget));

        TargetBudget = targetBudget;
    }

    public BudgetEstimate AddEstimate(
        BudgetCategoryType category,
        string name,
        decimal estimatedAmount)
    {
        var estimate = new BudgetEstimate(
            Id,
            category,
            name,
            estimatedAmount);

        _estimates.Add(estimate);

        return estimate;
    }

    public bool UpdateEstimate(
        Guid estimateId,
        string name,
        decimal estimatedAmount)
    {
        var estimate = _estimates.FirstOrDefault(x => x.Id == estimateId);
        if (estimate is null)
        {
            return false;
        }

        estimate.Update(name, estimatedAmount);
        return true;
    }

    public bool RemoveEstimate(Guid estimateId)
    {
        var estimate = _estimates.FirstOrDefault(x => x.Id == estimateId);
        if (estimate is null)
        {
            return false;
        }

        _estimates.Remove(estimate);
        return true;
    }

    public Expense AddExpense(
        BudgetCategoryType category,
        string title,
        decimal amount,
        DateOnly expenseDate,
        PaymentMethod? paymentMethod = null,
        string? notes = null,
        Guid? accommodationId = null,
        Guid? tripStopId = null)
    {
        var expense = new Expense(
            Id,
            category,
            title,
            amount,
            expenseDate,
            paymentMethod,
            notes,
            accommodationId,
            tripStopId);

        _expenses.Add(expense);

        return expense;
    }

    public bool UpdateExpense(
        Guid expenseId,
        BudgetCategoryType category,
        string title,
        decimal amount,
        DateOnly expenseDate,
        PaymentMethod? paymentMethod = null,
        string? notes = null,
        Guid? accommodationId = null,
        Guid? tripStopId = null)
    {
        var expense = _expenses.FirstOrDefault(x => x.Id == expenseId);
        if (expense is null)
        {
            return false;
        }

        expense.Update(
            category,
            title,
            amount,
            expenseDate,
            paymentMethod,
            notes,
            accommodationId,
            tripStopId);

        return true;
    }

    public bool RemoveExpense(Guid expenseId)
    {
        var expense = _expenses.FirstOrDefault(x => x.Id == expenseId);
        if (expense is null)
        {
            return false;
        }

        _expenses.Remove(expense);
        return true;
    }

    public BudgetEstimate? SyncAccommodationEstimate(
        Guid accommodationId,
        string title,
        decimal cost)
    {
        var existingEstimate = _estimates.FirstOrDefault(x => x.AccommodationId == accommodationId);

        if (cost <= 0)
        {
            if (existingEstimate is not null)
            {
                _estimates.Remove(existingEstimate);
            }
            return null;
        }

        if (existingEstimate is not null)
        {
            existingEstimate.Update(title, cost);
            return existingEstimate;
        }

        var newEstimate = new BudgetEstimate(
            Id,
            BudgetCategoryType.Accommodation,
            title,
            cost,
            accommodationId);

        _estimates.Add(newEstimate);
        return newEstimate;
    }

    public void RemoveAccommodationEstimate(Guid accommodationId)
    {
        var existingEstimate = _estimates.FirstOrDefault(x => x.AccommodationId == accommodationId);
        if (existingEstimate is not null)
        {
            _estimates.Remove(existingEstimate);
        }
    }

    public BudgetEstimate CalculateFuelEstimate(
        decimal routeDistanceKm,
        decimal vehicleMileage,
        decimal fuelPricePerLiter)
    {
        if (routeDistanceKm <= 0)
            throw new DomainException("Route distance must be greater than zero.");

        if (vehicleMileage <= 0)
            throw new DomainException("Vehicle mileage must be greater than zero.");

        if (fuelPricePerLiter <= 0)
            throw new DomainException("Fuel price must be greater than zero.");

        decimal fuelCost = Math.Round((routeDistanceKm / vehicleMileage) * fuelPricePerLiter, 2, MidpointRounding.AwayFromZero);

        const string autoCalculatedFuelName = "Auto Calculated Fuel";
        var existingEstimate = _estimates.FirstOrDefault(x =>
            x.Category == BudgetCategoryType.Fuel && x.Title == autoCalculatedFuelName);

        if (existingEstimate is not null)
        {
            existingEstimate.Update(autoCalculatedFuelName, fuelCost);
            return existingEstimate;
        }

        var estimate = new BudgetEstimate(
            Id,
            BudgetCategoryType.Fuel,
            autoCalculatedFuelName,
            fuelCost);

        _estimates.Add(estimate);
        return estimate;
    }
}