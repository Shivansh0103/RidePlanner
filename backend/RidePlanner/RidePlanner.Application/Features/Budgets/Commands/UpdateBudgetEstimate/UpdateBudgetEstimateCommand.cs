namespace RidePlanner.Application.Features.Budgets.Commands.UpdateBudgetEstimate;

public sealed record UpdateBudgetEstimateCommand(
    Guid TripId,
    Guid EstimateId,
    string Name,
    decimal EstimatedAmount);
