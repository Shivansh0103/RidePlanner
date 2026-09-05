using RidePlanner.Domain.Entities;
using RidePlanner.Domain.Enums;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Domain.Tests;

public class UserProfileDomainTests
{
    private static readonly Guid TestUserId = Guid.Parse("22222222-2222-2222-2222-222222222222");

    [Fact]
    public void CreateDefault_Sets_Correct_Initial_Preferences()
    {
        var profile = UserProfile.CreateDefault(TestUserId);

        Assert.Equal(TestUserId, profile.UserId);
        Assert.Equal("INR", profile.PreferredCurrencyCode);
        Assert.Equal(DistanceUnit.Kilometers, profile.DistanceUnit);
        Assert.Null(profile.DefaultVehicleName);
        Assert.Null(profile.DefaultTankCapacityLitres);
        Assert.Null(profile.DefaultFuelEfficiencyKmPerLitre);
        Assert.True(profile.CreatedAt <= DateTimeOffset.UtcNow);
        Assert.True(profile.UpdatedAt <= DateTimeOffset.UtcNow);
    }

    [Fact]
    public void CreateDefault_With_Empty_UserId_Throws_DomainException()
    {
        var ex = Assert.Throws<DomainException>(() => UserProfile.CreateDefault(Guid.Empty));
        Assert.Contains("UserId cannot be empty", ex.Message);
    }

    [Fact]
    public void UpdatePreferences_With_Valid_Values_Updates_All_Fields()
    {
        var profile = UserProfile.CreateDefault(TestUserId);

        profile.UpdatePreferences(
            preferredCurrencyCode: "USD",
            distanceUnit: DistanceUnit.Miles,
            defaultVehicleName: "Honda Transalp 750",
            defaultTankCapacityLitres: 16.9m,
            defaultFuelEfficiencyKmPerLitre: 23.5m);

        Assert.Equal("USD", profile.PreferredCurrencyCode);
        Assert.Equal(DistanceUnit.Miles, profile.DistanceUnit);
        Assert.Equal("Honda Transalp 750", profile.DefaultVehicleName);
        Assert.Equal(16.9m, profile.DefaultTankCapacityLitres);
        Assert.Equal(23.5m, profile.DefaultFuelEfficiencyKmPerLitre);
    }

    [Theory]
    [InlineData("INR")]
    [InlineData("inr")]
    [InlineData("USD")]
    [InlineData("usd")]
    [InlineData("EUR")]
    [InlineData("eur")]
    [InlineData("GBP")]
    [InlineData("gbp")]
    public void UpdatePreferences_With_Supported_Currencies_Succeeds_And_Normalizes_To_Uppercase(string currency)
    {
        var profile = UserProfile.CreateDefault(TestUserId);

        profile.UpdatePreferences(
            preferredCurrencyCode: currency,
            distanceUnit: DistanceUnit.Kilometers,
            defaultVehicleName: null,
            defaultTankCapacityLitres: null,
            defaultFuelEfficiencyKmPerLitre: null);

        Assert.Equal(currency.ToUpperInvariant(), profile.PreferredCurrencyCode);
    }

    [Theory]
    [InlineData("JPY")]
    [InlineData("CAD")]
    [InlineData("AUD")]
    [InlineData("")]
    [InlineData(" ")]
    public void UpdatePreferences_With_Unsupported_Currency_Throws_DomainException(string invalidCurrency)
    {
        var profile = UserProfile.CreateDefault(TestUserId);

        var ex = Assert.Throws<DomainException>(() => profile.UpdatePreferences(
            preferredCurrencyCode: invalidCurrency,
            distanceUnit: DistanceUnit.Kilometers,
            defaultVehicleName: null,
            defaultTankCapacityLitres: null,
            defaultFuelEfficiencyKmPerLitre: null));

        Assert.Contains("is not supported", ex.Message);
    }

    [Fact]
    public void UpdatePreferences_With_VehicleName_Exceeding_100_Chars_Throws_DomainException()
    {
        var profile = UserProfile.CreateDefault(TestUserId);
        var longName = new string('A', 101);

        var ex = Assert.Throws<DomainException>(() => profile.UpdatePreferences(
            preferredCurrencyCode: "INR",
            distanceUnit: DistanceUnit.Kilometers,
            defaultVehicleName: longName,
            defaultTankCapacityLitres: null,
            defaultFuelEfficiencyKmPerLitre: null));

        Assert.Contains("cannot exceed 100 characters", ex.Message);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-5)]
    [InlineData(1001)]
    public void UpdatePreferences_With_Invalid_Tank_Capacity_Throws_DomainException(decimal invalidTank)
    {
        var profile = UserProfile.CreateDefault(TestUserId);

        var ex = Assert.Throws<DomainException>(() => profile.UpdatePreferences(
            preferredCurrencyCode: "INR",
            distanceUnit: DistanceUnit.Kilometers,
            defaultVehicleName: null,
            defaultTankCapacityLitres: invalidTank,
            defaultFuelEfficiencyKmPerLitre: null));

        Assert.Contains("Tank capacity must be positive and not exceed 1,000 litres", ex.Message);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-15)]
    [InlineData(201)]
    public void UpdatePreferences_With_Invalid_Fuel_Efficiency_Throws_DomainException(decimal invalidMileage)
    {
        var profile = UserProfile.CreateDefault(TestUserId);

        var ex = Assert.Throws<DomainException>(() => profile.UpdatePreferences(
            preferredCurrencyCode: "INR",
            distanceUnit: DistanceUnit.Kilometers,
            defaultVehicleName: null,
            defaultTankCapacityLitres: null,
            defaultFuelEfficiencyKmPerLitre: invalidMileage));

        Assert.Contains("Fuel efficiency must be positive and not exceed 200 km/L", ex.Message);
    }
}
