using RidePlanner.Domain.Entities;

namespace RidePlanner.Application.Features.Users.DTOs;

public sealed record UserProfileDto(
    string PreferredCurrencyCode,
    string DistanceUnit,
    string? DefaultVehicleName,
    decimal? DefaultTankCapacityLitres,
    decimal? DefaultFuelEfficiencyKmPerLitre,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt)
{
    public static UserProfileDto FromEntity(UserProfile profile)
    {
        return new UserProfileDto(
            profile.PreferredCurrencyCode,
            profile.DistanceUnit.ToString(),
            profile.DefaultVehicleName,
            profile.DefaultTankCapacityLitres,
            profile.DefaultFuelEfficiencyKmPerLitre,
            profile.CreatedAt,
            profile.UpdatedAt);
    }
}
