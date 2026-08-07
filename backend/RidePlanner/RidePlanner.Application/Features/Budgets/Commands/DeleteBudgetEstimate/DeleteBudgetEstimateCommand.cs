namespace RidePlanner.Application.Features.Budgets.Commands.DeleteBudgetEstimate;

public sealed record DeleteBudgetEstimateCommand(
    Guid TripId,
    Guid EstimateId);
