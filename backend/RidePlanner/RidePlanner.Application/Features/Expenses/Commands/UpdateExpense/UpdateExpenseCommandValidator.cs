using FluentValidation;

namespace RidePlanner.Application.Features.Expenses.Commands.UpdateExpense;

public sealed class UpdateExpenseCommandValidator : AbstractValidator<UpdateExpenseCommand>
{
    public UpdateExpenseCommandValidator()
    {
        RuleFor(x => x.TripId).NotEmpty().WithMessage("Trip ID is required.");
        RuleFor(x => x.ExpenseId).NotEmpty().WithMessage("Expense ID is required.");
        RuleFor(x => x.Title).NotEmpty().WithMessage("Expense title cannot be empty.");
        RuleFor(x => x.Amount).GreaterThan(0m).WithMessage("Expense amount must be greater than zero.");
    }
}
