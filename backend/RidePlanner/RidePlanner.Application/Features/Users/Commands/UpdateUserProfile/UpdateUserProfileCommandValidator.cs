using FluentValidation;
using RidePlanner.Domain.Entities;

namespace RidePlanner.Application.Features.Users.Commands.UpdateUserProfile;

public sealed class UpdateUserProfileCommandValidator : AbstractValidator<UpdateUserProfileCommand>
{
    public UpdateUserProfileCommandValidator()
    {
        RuleFor(x => x.PreferredCurrencyCode)
            .NotEmpty()
            .WithMessage("Preferred currency code cannot be empty.")
            .Must(c => !string.IsNullOrWhiteSpace(c) && UserProfile.SupportedCurrencies.Contains(c.Trim().ToUpperInvariant()))
            .WithMessage($"Currency must be one of: {string.Join(", ", UserProfile.SupportedCurrencies)}.");

        RuleFor(x => x.DistanceUnit)
            .IsInEnum()
            .WithMessage("Distance unit must be Kilometers or Miles.");

        RuleFor(x => x.DefaultVehicleName)
            .MaximumLength(100)
            .WithMessage("Vehicle name cannot exceed 100 characters.");

        RuleFor(x => x.DefaultTankCapacityLitres)
            .GreaterThan(0)
            .When(x => x.DefaultTankCapacityLitres.HasValue)
            .WithMessage("Tank capacity must be greater than zero.")
            .LessThanOrEqualTo(1000m)
            .When(x => x.DefaultTankCapacityLitres.HasValue)
            .WithMessage("Tank capacity cannot exceed 1,000 litres.");

        RuleFor(x => x.DefaultFuelEfficiencyKmPerLitre)
            .GreaterThan(0)
            .When(x => x.DefaultFuelEfficiencyKmPerLitre.HasValue)
            .WithMessage("Fuel efficiency must be greater than zero.")
            .LessThanOrEqualTo(200m)
            .When(x => x.DefaultFuelEfficiencyKmPerLitre.HasValue)
            .WithMessage("Fuel efficiency cannot exceed 200 km/L.");
    }
}
