using MediatR;
using RidePlanner.Application.Features.Budgets.DTOs;

namespace RidePlanner.Application.Features.Budgets.Commands.UpdateBudgetEstimate;

public sealed record UpdateBudgetEstimateCommand(
    Guid TripId,
    Guid EstimateId,
    string Name,
    decimal EstimatedAmount) : IRequest<TripBudgetDto?>;
