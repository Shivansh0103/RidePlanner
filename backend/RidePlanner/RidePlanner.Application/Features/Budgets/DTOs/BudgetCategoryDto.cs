using RidePlanner.Domain.Enums;

namespace RidePlanner.Application.Features.Budgets.DTOs;

public sealed class BudgetCategoryDto
{
    public BudgetCategoryType Category { get; init; }

    public decimal EstimatedAmount { get; init; }

    public List<BudgetEstimateDto> Estimates { get; init; } = [];
}