using MediatR;
using RidePlanner.Application.Features.Budgets.DTOs;

namespace RidePlanner.Application.Features.Budgets.Commands.DeleteBudgetEstimate;

public sealed record DeleteBudgetEstimateCommand(
    Guid TripId,
    Guid EstimateId) : IRequest<TripBudgetDto?>;
