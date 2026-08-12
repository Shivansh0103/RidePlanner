using RidePlanner.Domain.Common;
using RidePlanner.Domain.Enums;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Domain.Entities.Budget;

public class Expense : Entity
{
    private Expense()
    {
    }

    public Expense(
        Guid tripBudgetId,
        BudgetCategoryType category,
        string title,
        decimal amount,
        DateOnly expenseDate,
        PaymentMethod? paymentMethod = null,
        string? notes = null,
        Guid? accommodationId = null,
        Guid? tripStopId = null)
    {
        Validate(title, amount, category, paymentMethod, notes);

        Id = Guid.NewGuid();
        TripBudgetId = tripBudgetId;
        Category = category;
        Title = title.Trim();
        Amount = amount;
        ExpenseDate = expenseDate;
        PaymentMethod = paymentMethod;
        Notes = notes?.Trim();
        AccommodationId = accommodationId;
        TripStopId = tripStopId;
        CreatedAt = DateTimeOffset.UtcNow;
    }

    public Guid TripBudgetId { get; private set; }

    public BudgetCategoryType Category { get; private set; }

    public string Title { get; private set; } = string.Empty;

    public decimal Amount { get; private set; }

    public DateOnly ExpenseDate { get; private set; }

    public PaymentMethod? PaymentMethod { get; private set; }

    public string? Notes { get; private set; }

    public Guid? AccommodationId { get; private set; }

    public Guid? TripStopId { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }

    public TripBudget TripBudget { get; private set; } = null!;

    public Accommodation? Accommodation { get; private set; }

    public TripStop? TripStop { get; private set; }

    public void Update(
        BudgetCategoryType category,
        string title,
        decimal amount,
        DateOnly expenseDate,
        PaymentMethod? paymentMethod = null,
        string? notes = null,
        Guid? accommodationId = null,
        Guid? tripStopId = null)
    {
        Validate(title, amount, category, paymentMethod, notes);

        Category = category;
        Title = title.Trim();
        Amount = amount;
        ExpenseDate = expenseDate;
        PaymentMethod = paymentMethod;
        Notes = notes?.Trim();
        AccommodationId = accommodationId;
        TripStopId = tripStopId;
    }

    private static void Validate(
        string title,
        decimal amount,
        BudgetCategoryType category,
        PaymentMethod? paymentMethod,
        string? notes)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new DomainException("Title is required.");

        if (title.Trim().Length > 200)
            throw new DomainException("Title cannot exceed 200 characters.");

        if (amount <= 0)
            throw new DomainException("Expense amount must be greater than zero.");

        if (!Enum.IsDefined(category))
            throw new DomainException("Invalid budget category.");

        if (paymentMethod.HasValue && !Enum.IsDefined(paymentMethod.Value))
            throw new DomainException("Invalid payment method.");

        if (notes?.Trim().Length > 1000)
            throw new DomainException("Notes cannot exceed 1000 characters.");
    }
}
