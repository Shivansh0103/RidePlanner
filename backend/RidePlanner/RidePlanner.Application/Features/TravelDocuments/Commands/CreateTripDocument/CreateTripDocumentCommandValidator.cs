using FluentValidation;

namespace RidePlanner.Application.Features.TravelDocuments.Commands.CreateTripDocument;

public sealed class CreateTripDocumentCommandValidator : AbstractValidator<CreateTripDocumentCommand>
{
    public CreateTripDocumentCommandValidator()
    {
        RuleFor(x => x.TripId).NotEmpty().WithMessage("Trip ID is required.");
        RuleFor(x => x.Title).NotEmpty().WithMessage("Document title cannot be empty.");
        RuleFor(x => x.Type).NotEmpty().WithMessage("Document type cannot be empty.");
    }
}
