using MediatR;
using RidePlanner.Application.Features.Expenses.DTOs;
using RidePlanner.Domain.Enums;

namespace RidePlanner.Application.Features.Expenses.Commands.CreateExpense;

public sealed record CreateExpenseCommand(
    Guid TripId,
    BudgetCategoryType Category,
    string Title,
    decimal Amount,
    DateOnly ExpenseDate,
    PaymentMethod? PaymentMethod = null,
    string? Notes = null,
    Guid? AccommodationId = null,
    Guid? TripStopId = null) : IRequest<ExpenseDto?>;
