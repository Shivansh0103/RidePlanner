using FluentValidation;

namespace RidePlanner.Application.Features.Expenses.Commands.CreateExpense;

public sealed class CreateExpenseCommandValidator : AbstractValidator<CreateExpenseCommand>
{
    public CreateExpenseCommandValidator()
    {
        RuleFor(x => x.TripId).NotEmpty().WithMessage("Trip ID is required.");
        RuleFor(x => x.Title).NotEmpty().WithMessage("Expense title cannot be empty.");
        RuleFor(x => x.Amount).GreaterThan(0m).WithMessage("Expense amount must be greater than zero.");
    }
}
