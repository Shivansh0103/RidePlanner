using FluentValidation;

namespace RidePlanner.Application.Features.Checklists.Commands.CreateItem;

public sealed class CreateChecklistItemCommandValidator : AbstractValidator<CreateChecklistItemCommand>
{
    public CreateChecklistItemCommandValidator()
    {
        RuleFor(x => x.TripId).NotEmpty().WithMessage("Trip ID is required.");
        RuleFor(x => x.CategoryId).NotEmpty().WithMessage("Category ID is required.");
        RuleFor(x => x.Title).NotEmpty().WithMessage("Item title cannot be empty.");
    }
}
