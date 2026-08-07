namespace RidePlanner.Application.Features.Budgets.DTOs;

public sealed class UpdateBudgetEstimateRequest
{
    public string Name { get; init; } = string.Empty;

    public decimal EstimatedAmount { get; init; }
}
