using RidePlanner.Domain.Enums;
using RidePlanner.Domain.Exceptions;

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
        decimal estimatedAmount,
        Guid? accommodationId = null)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new DomainException("Name is required.");

        if (estimatedAmount < 0)
            throw new DomainException("Estimated amount cannot be negative.");

        if (!Enum.IsDefined(category))
            throw new DomainException("Invalid budget category.");

        TripBudgetId = tripBudgetId;
        Category = category;
        Title = title;
        EstimatedAmount = estimatedAmount;
        AccommodationId = accommodationId;
    }

    public Guid Id { get; private set; }

    public Guid TripBudgetId { get; private set; }

    public BudgetCategoryType Category { get; private set; }

    public string Title { get; private set; } = string.Empty;

    public decimal EstimatedAmount { get; private set; }

    public Guid? AccommodationId { get; private set; }

    public TripBudget TripBudget { get; private set; } = null!;

    public Accommodation? Accommodation { get; private set; }

    public void Update(string title, decimal estimatedAmount)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new DomainException("Name is required.");

        if (estimatedAmount < 0)
            throw new DomainException("Estimated amount cannot be negative.");

        Title = title;
        EstimatedAmount = estimatedAmount;
    }
}