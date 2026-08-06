namespace RidePlanner.Application.Features.Budgets.DTOs;

public sealed class BudgetEstimateDto
{
    public Guid Id { get; init; }

    public string Title { get; init; } = string.Empty;

    public decimal EstimatedAmount { get; init; }
}