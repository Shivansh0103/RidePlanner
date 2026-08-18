using FluentValidation;

namespace RidePlanner.Application.Features.EmergencyContacts.Commands.CreateEmergencyContact;

public sealed class CreateEmergencyContactCommandValidator : AbstractValidator<CreateEmergencyContactCommand>
{
    public CreateEmergencyContactCommandValidator()
    {
        RuleFor(x => x.TripId).NotEmpty().WithMessage("Trip ID is required.");
        RuleFor(x => x.Name).NotEmpty().WithMessage("Contact name cannot be empty.");
        RuleFor(x => x.Phone).NotEmpty().WithMessage("Phone number cannot be empty.");
    }
}
