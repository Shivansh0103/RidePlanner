using RidePlanner.Application.Features.Budgets.DTOs;
using RidePlanner.Application.Features.Expenses.Mappings;
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
                ActualAmount = budget.GetCategoryActualTotal(category),
                Variance = budget.GetCategoryVariance(category),
                Estimates = budget.Estimates
                    .Where(x => x.Category == category)
                    .OrderBy(x => x.Title)
                    .Select(x => new BudgetEstimateDto
                    {
                        Id = x.Id,
                        Title = x.Title,
                        EstimatedAmount = x.EstimatedAmount,
                        AccommodationId = x.AccommodationId
                    })
                    .ToList(),
                Expenses = budget.Expenses
                    .Where(x => x.Category == category)
                    .OrderByDescending(x => x.ExpenseDate)
                    .ThenByDescending(x => x.CreatedAt)
                    .Select(x => x.ToDto())
                    .ToList()
            })
            .ToList();

        return new TripBudgetDto
        {
            TargetBudget = budget.TargetBudget,
            EstimatedCost = budget.EstimatedCost,
            ActualCost = budget.ActualCost,
            RemainingBuffer = budget.RemainingBuffer,
            RemainingTargetBuffer = budget.RemainingTargetBuffer,
            Variance = budget.Variance,
            Categories = categories
        };
    }
}