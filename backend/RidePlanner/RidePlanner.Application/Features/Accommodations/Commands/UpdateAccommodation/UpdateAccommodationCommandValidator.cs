using FluentValidation;

namespace RidePlanner.Application.Features.Accommodations.Commands.UpdateAccommodation;

public sealed class UpdateAccommodationCommandValidator : AbstractValidator<UpdateAccommodationCommand>
{
    public UpdateAccommodationCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty().WithMessage("Accommodation ID is required.");
        RuleFor(x => x.TripId).NotEmpty().WithMessage("Trip ID is required.");
        RuleFor(x => x.Name).NotEmpty().WithMessage("Accommodation name cannot be empty.");
        RuleFor(x => x.Cost).GreaterThanOrEqualTo(0m).WithMessage("Cost cannot be negative.");
        RuleFor(x => x.CheckOutDate).GreaterThanOrEqualTo(x => x.CheckInDate).WithMessage("Check-out date cannot be before check-in date.");
    }
}
