using MediatR;
using RidePlanner.Application.Features.Budgets.DTOs;

namespace RidePlanner.Application.Features.Budgets.Queries.GetTripBudget;

public sealed record GetTripBudgetQuery(Guid TripId) : IRequest<TripBudgetDto?>;