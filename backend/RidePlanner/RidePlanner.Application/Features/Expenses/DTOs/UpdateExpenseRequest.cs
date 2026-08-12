using RidePlanner.Domain.Enums;

namespace RidePlanner.Application.Features.Expenses.DTOs;

public sealed class UpdateExpenseRequest
{
    public BudgetCategoryType Category { get; init; }

    public string Title { get; init; } = string.Empty;

    public decimal Amount { get; init; }

    public DateOnly ExpenseDate { get; init; }

    public PaymentMethod? PaymentMethod { get; init; }

    public string? Notes { get; init; }

    public Guid? AccommodationId { get; init; }

    public Guid? TripStopId { get; init; }
}
