using RidePlanner.Application.Features.Expenses.DTOs;
using RidePlanner.Domain.Entities.Budget;

namespace RidePlanner.Application.Features.Expenses.Mappings;

public static class ExpenseMappings
{
    public static ExpenseDto ToDto(this Expense expense)
    {
        return new ExpenseDto
        {
            Id = expense.Id,
            TripBudgetId = expense.TripBudgetId,
            Category = expense.Category,
            Title = expense.Title,
            Amount = expense.Amount,
            ExpenseDate = expense.ExpenseDate,
            PaymentMethod = expense.PaymentMethod,
            Notes = expense.Notes,
            AccommodationId = expense.AccommodationId,
            TripStopId = expense.TripStopId,
            CreatedAt = expense.CreatedAt
        };
    }
}
