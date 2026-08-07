using RidePlanner.Domain.Enums;

namespace RidePlanner.Application.Features.Budgets.DTOs;

public sealed class CreateBudgetEstimateRequest
{
    public BudgetCategoryType Category { get; init; }

    public string Name { get; init; } = string.Empty;

    public decimal EstimatedAmount { get; init; }
}
