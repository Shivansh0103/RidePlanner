using MediatR;
using RidePlanner.Application.Features.Expenses.DTOs;
using RidePlanner.Domain.Enums;

namespace RidePlanner.Application.Features.Expenses.Commands.UpdateExpense;

public sealed record UpdateExpenseCommand(
    Guid TripId,
    Guid ExpenseId,
    BudgetCategoryType Category,
    string Title,
    decimal Amount,
    DateOnly ExpenseDate,
    PaymentMethod? PaymentMethod = null,
    string? Notes = null,
    Guid? AccommodationId = null,
    Guid? TripStopId = null) : IRequest<ExpenseDto?>;
