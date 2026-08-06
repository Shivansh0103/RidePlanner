using RidePlanner.Application.Features.Budgets.DTOs;
using RidePlanner.Domain.Entities.Budget;
using RidePlanner.Domain.Enums;

namespace RidePlanner.Application.Features.Budgets.Mapping;

public static class BudgetMappings
{
    public static TripBudgetDto ToDto(this TripBudget budget)
    {
        var categories = Enum
            .GetValues<BudgetCategoryType>()
            .Select(category => new BudgetCategoryDto
            {
                Category = category,

                EstimatedAmount = budget.GetCategoryTotal(category),

                Estimates = budget.Estimates
                    .Where(x => x.Category == category)
                    .OrderBy(x => x.Title)
                    .Select(x => new BudgetEstimateDto
                    {
                        Id = x.Id,
                        Title = x.Title,
                        EstimatedAmount = x.EstimatedAmount
                    })
                    .ToList()
            })
            .ToList();

        return new TripBudgetDto
        {
            TargetBudget = budget.TargetBudget,
            EstimatedCost = budget.EstimatedCost,
            RemainingBuffer = budget.RemainingBuffer,
            Categories = categories
        };
    }
}