using RidePlanner.Application.Features.Expenses.DTOs;
using RidePlanner.Domain.Enums;

namespace RidePlanner.Application.Features.Budgets.DTOs;

public sealed class BudgetCategoryDto
{
    public BudgetCategoryType Category { get; init; }

    public decimal EstimatedAmount { get; init; }

    public decimal ActualAmount { get; init; }

    public decimal Variance { get; init; }

    public List<BudgetEstimateDto> Estimates { get; init; } = [];

    public List<ExpenseDto> Expenses { get; init; } = [];
}