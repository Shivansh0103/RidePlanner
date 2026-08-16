using MediatR;
using RidePlanner.Application.Features.Budgets.DTOs;

namespace RidePlanner.Application.Features.Budgets.Commands.UpdateTripBudget;

public sealed record UpdateTripBudgetCommand(
    Guid TripId,
    decimal TargetBudget) : IRequest<TripBudgetDto?>;