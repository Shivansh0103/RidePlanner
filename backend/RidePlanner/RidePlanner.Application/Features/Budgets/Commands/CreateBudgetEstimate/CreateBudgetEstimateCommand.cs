using MediatR;
using RidePlanner.Application.Features.Budgets.DTOs;
using RidePlanner.Domain.Enums;

namespace RidePlanner.Application.Features.Budgets.Commands.CreateBudgetEstimate;

public sealed record CreateBudgetEstimateCommand(
    Guid TripId,
    BudgetCategoryType Category,
    string Name,
    decimal EstimatedAmount) : IRequest<TripBudgetDto?>;
