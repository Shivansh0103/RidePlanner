using FluentValidation;

namespace RidePlanner.Application.Features.TripStops.Commands.UpdateTripStop;

public sealed class UpdateTripStopCommandValidator : AbstractValidator<UpdateTripStopCommand>
{
    public UpdateTripStopCommandValidator()
    {
        RuleFor(x => x.TripId).NotEmpty().WithMessage("Trip ID is required.");
        RuleFor(x => x.StopId).NotEmpty().WithMessage("Stop ID is required.");
        RuleFor(x => x.Name).NotEmpty().WithMessage("Stop name cannot be empty.");
        RuleFor(x => x.DepartureDate).GreaterThanOrEqualTo(x => x.ArrivalDate).WithMessage("Departure date cannot be before arrival date.");
    }
}
