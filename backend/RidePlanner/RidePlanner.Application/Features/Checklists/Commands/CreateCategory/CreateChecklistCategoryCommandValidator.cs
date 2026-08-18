using FluentValidation;

namespace RidePlanner.Application.Features.Checklists.Commands.CreateCategory;

public sealed class CreateChecklistCategoryCommandValidator : AbstractValidator<CreateChecklistCategoryCommand>
{
    public CreateChecklistCategoryCommandValidator()
    {
        RuleFor(x => x.TripId).NotEmpty().WithMessage("Trip ID is required.");
        RuleFor(x => x.Name).NotEmpty().WithMessage("Category name cannot be empty.");
    }
}
