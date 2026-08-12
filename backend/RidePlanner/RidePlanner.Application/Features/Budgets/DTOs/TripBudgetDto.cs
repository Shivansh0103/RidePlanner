namespace RidePlanner.Application.Features.Budgets.DTOs;

public sealed class TripBudgetDto
{
    public decimal TargetBudget { get; init; }

    public decimal EstimatedCost { get; init; }

    public decimal ActualCost { get; init; }

    public decimal RemainingBuffer { get; init; }

    public decimal RemainingTargetBuffer { get; init; }

    public decimal Variance { get; init; }

    public List<BudgetCategoryDto> Categories { get; init; } = [];
}