using FluentValidation;

namespace RidePlanner.Application.Features.Budgets.Commands.UpdateTripBudget;

public sealed class UpdateTripBudgetCommandValidator : AbstractValidator<UpdateTripBudgetCommand>
{
    public UpdateTripBudgetCommandValidator()
    {
        RuleFor(x => x.TripId).NotEmpty().WithMessage("Trip ID is required.");
        RuleFor(x => x.TargetBudget).GreaterThanOrEqualTo(0m).WithMessage("Target budget cannot be negative.");
    }
}
