using MediatR;
using RidePlanner.Application.Features.Users.DTOs;
using RidePlanner.Domain.Enums;

namespace RidePlanner.Application.Features.Users.Commands.UpdateUserProfile;

public sealed record UpdateUserProfileCommand(
    string PreferredCurrencyCode,
    DistanceUnit DistanceUnit,
    string? DefaultVehicleName,
    decimal? DefaultTankCapacityLitres,
    decimal? DefaultFuelEfficiencyKmPerLitre) : IRequest<UserProfileDto>;
