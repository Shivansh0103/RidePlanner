using MediatR;
using RidePlanner.Application.Features.Expenses.DTOs;

namespace RidePlanner.Application.Features.Expenses.Queries.GetTripExpenses;

public sealed record GetTripExpensesQuery(Guid TripId) : IRequest<IReadOnlyList<ExpenseDto>?>;
