using RidePlanner.Domain.Enums;

namespace RidePlanner.Domain.Entities.Budget;

public class BudgetEstimate
{
    private BudgetEstimate()
    {
    }

    public BudgetEstimate(
        Guid tripBudgetId,
        BudgetCategoryType category,
        string title,
        decimal estimatedAmount)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException("Title cannot be empty.", nameof(title));

        if (estimatedAmount < 0)
            throw new ArgumentOutOfRangeException(nameof(estimatedAmount));

        Id = Guid.NewGuid();
        TripBudgetId = tripBudgetId;
        Category = category;
        Title = title;
        EstimatedAmount = estimatedAmount;
    }

    public Guid Id { get; private set; }

    public Guid TripBudgetId { get; private set; }

    public BudgetCategoryType Category { get; private set; }

    public string Title { get; private set; } = string.Empty;

    public decimal EstimatedAmount { get; private set; }

    public TripBudget TripBudget { get; private set; } = null!;
}