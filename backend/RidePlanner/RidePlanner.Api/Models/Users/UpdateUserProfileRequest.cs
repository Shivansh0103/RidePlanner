using RidePlanner.Domain.Enums;

namespace RidePlanner.Api.Models.Users;

public sealed record UpdateUserProfileRequest(
    string PreferredCurrencyCode,
    DistanceUnit DistanceUnit,
    string? DefaultVehicleName,
    decimal? DefaultTankCapacityLitres,
    decimal? DefaultFuelEfficiencyKmPerLitre);
