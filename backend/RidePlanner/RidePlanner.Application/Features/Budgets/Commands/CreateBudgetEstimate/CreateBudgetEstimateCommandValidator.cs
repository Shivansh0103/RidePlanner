using FluentValidation;

namespace RidePlanner.Application.Features.Budgets.Commands.CreateBudgetEstimate;

public sealed class CreateBudgetEstimateCommandValidator : AbstractValidator<CreateBudgetEstimateCommand>
{
    public CreateBudgetEstimateCommandValidator()
    {
        RuleFor(x => x.TripId).NotEmpty().WithMessage("Trip ID is required.");
        RuleFor(x => x.Name).NotEmpty().WithMessage("Estimate name cannot be empty.");
        RuleFor(x => x.EstimatedAmount).GreaterThanOrEqualTo(0m).WithMessage("Estimated amount cannot be negative.");
    }
}
