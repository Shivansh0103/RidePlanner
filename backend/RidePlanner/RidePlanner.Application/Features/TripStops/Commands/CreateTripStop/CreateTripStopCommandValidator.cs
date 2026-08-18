using FluentValidation;

namespace RidePlanner.Application.Features.TripStops.Commands.CreateTripStop;

public sealed class CreateTripStopCommandValidator : AbstractValidator<CreateTripStopCommand>
{
    public CreateTripStopCommandValidator()
    {
        RuleFor(x => x.TripId).NotEmpty().WithMessage("Trip ID is required.");
        RuleFor(x => x.Name).NotEmpty().WithMessage("Stop name cannot be empty.");
        RuleFor(x => x.DepartureDate).GreaterThanOrEqualTo(x => x.ArrivalDate).WithMessage("Departure date cannot be before arrival date.");
    }
}
