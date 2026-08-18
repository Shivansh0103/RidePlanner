using FluentValidation;

namespace RidePlanner.Application.Features.Accommodations.Commands.CreateAccommodation;

public sealed class CreateAccommodationCommandValidator : AbstractValidator<CreateAccommodationCommand>
{
    public CreateAccommodationCommandValidator()
    {
        RuleFor(x => x.TripId).NotEmpty().WithMessage("Trip ID is required.");
        RuleFor(x => x.Name).NotEmpty().WithMessage("Accommodation name cannot be empty.");
        RuleFor(x => x.Cost).GreaterThanOrEqualTo(0m).WithMessage("Cost cannot be negative.");
        RuleFor(x => x.CheckOutDate).GreaterThanOrEqualTo(x => x.CheckInDate).WithMessage("Check-out date cannot be before check-in date.");
    }
}
