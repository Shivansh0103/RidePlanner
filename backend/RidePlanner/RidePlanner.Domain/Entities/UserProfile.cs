using RidePlanner.Domain.Common;
using RidePlanner.Domain.Enums;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Domain.Entities;

public class UserProfile : IAuditableEntity
{
    public static readonly string[] SupportedCurrencies = ["INR", "USD", "EUR", "GBP"];

    public Guid UserId { get; private set; }
    public string PreferredCurrencyCode { get; private set; } = "INR";
    public DistanceUnit DistanceUnit { get; private set; } = DistanceUnit.Kilometers;
    public string? DefaultVehicleName { get; private set; }
    public decimal? DefaultTankCapacityLitres { get; private set; }
    public decimal? DefaultFuelEfficiencyKmPerLitre { get; private set; }
    public DateTimeOffset CreatedAt { get; private set; }
    public DateTimeOffset UpdatedAt { get; private set; }

    private UserProfile()
    {
    }

    private UserProfile(Guid userId)
    {
        if (userId == Guid.Empty)
            throw new DomainException("UserId cannot be empty.");

        UserId = userId;
        PreferredCurrencyCode = "INR";
        DistanceUnit = DistanceUnit.Kilometers;
        CreatedAt = DateTimeOffset.UtcNow;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public static UserProfile CreateDefault(Guid userId)
    {
        return new UserProfile(userId);
    }

    public void UpdatePreferences(
        string preferredCurrencyCode,
        DistanceUnit distanceUnit,
        string? defaultVehicleName,
        decimal? defaultTankCapacityLitres,
        decimal? defaultFuelEfficiencyKmPerLitre)
    {
        ValidateCurrency(preferredCurrencyCode);
        ValidateVehicle(defaultVehicleName, defaultTankCapacityLitres, defaultFuelEfficiencyKmPerLitre);

        PreferredCurrencyCode = preferredCurrencyCode.Trim().ToUpperInvariant();
        DistanceUnit = distanceUnit;
        DefaultVehicleName = string.IsNullOrWhiteSpace(defaultVehicleName) ? null : defaultVehicleName.Trim();
        DefaultTankCapacityLitres = defaultTankCapacityLitres;
        DefaultFuelEfficiencyKmPerLitre = defaultFuelEfficiencyKmPerLitre;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    private static void ValidateCurrency(string? currency)
    {
        if (string.IsNullOrWhiteSpace(currency) || !SupportedCurrencies.Contains(currency.Trim().ToUpperInvariant()))
        {
            throw new DomainException($"Currency '{currency}' is not supported. Supported currencies are: {string.Join(", ", SupportedCurrencies)}.");
        }
    }

    private static void ValidateVehicle(string? name, decimal? tank, decimal? mileage)
    {
        if (name != null && name.Trim().Length > 100)
        {
            throw new DomainException("Vehicle name cannot exceed 100 characters.");
        }

        if (tank.HasValue && (tank.Value <= 0 || tank.Value > 1000m))
        {
            throw new DomainException("Tank capacity must be positive and not exceed 1,000 litres.");
        }

        if (mileage.HasValue && (mileage.Value <= 0 || mileage.Value > 200m))
        {
            throw new DomainException("Fuel efficiency must be positive and not exceed 200 km/L.");
        }
    }
}
