using RidePlanner.Domain.Enums;

namespace RidePlanner.Domain.Entities.Budget;

public class TripBudget
{
    private readonly List<BudgetEstimate> _estimates = [];

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

    public Trip Trip { get; private set; } = null!;

    public decimal EstimatedCost =>
        _estimates.Sum(x => x.EstimatedAmount);

    public decimal RemainingBuffer =>
        TargetBudget - EstimatedCost;

    public decimal GetCategoryTotal(BudgetCategoryType category)
    {
        return _estimates
            .Where(x => x.Category == category)
            .Sum(x => x.EstimatedAmount);
    }

    public void UpdateTargetBudget(decimal targetBudget)
    {
        if (targetBudget < 0)
            throw new ArgumentOutOfRangeException(nameof(targetBudget));

        TargetBudget = targetBudget;
    }
}