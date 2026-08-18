using FluentValidation;

namespace RidePlanner.Application.Features.Trips.Commands.CreateTrip;

public sealed class CreateTripCommandValidator : AbstractValidator<CreateTripCommand>
{
    public CreateTripCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Trip name cannot be empty.")
            .MaximumLength(100).WithMessage("Trip name cannot exceed 100 characters.");

        RuleFor(x => x.EndDate)
            .GreaterThanOrEqualTo(x => x.StartDate)
            .WithMessage("End date cannot be before start date.");
    }
}
