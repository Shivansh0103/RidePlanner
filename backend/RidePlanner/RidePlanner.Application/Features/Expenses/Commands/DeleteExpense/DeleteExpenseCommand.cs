namespace RidePlanner.Application.Features.Expenses.Commands.DeleteExpense;

public sealed record DeleteExpenseCommand(
    Guid TripId,
    Guid ExpenseId);
