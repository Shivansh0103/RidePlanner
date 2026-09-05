using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc;
using RidePlanner.Application.Features.Auth.DTOs;
using RidePlanner.Application.Features.Users.DTOs;
using RidePlanner.Domain.Enums;

namespace RidePlanner.Api.IntegrationTests;

public class UsersEndpointIntegrationTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;

    public UsersEndpointIntegrationTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
    }

    private HttpClient CreateClient() => _factory.CreateClient();

    private async Task<(HttpClient Client, Guid UserId)> CreateAuthenticatedClientAsync()
    {
        var client = CreateClient();
        var email = $"rider_{Guid.NewGuid():N}@example.com";
        var password = "SecurePassword123!";

        var regRes = await client.PostAsJsonAsync("/api/auth/register", new RegisterRequest(email, password));
        regRes.EnsureSuccessStatusCode();
        var regData = await regRes.Content.ReadFromJsonAsync<RegisterResponse>();

        var loginRes = await client.PostAsJsonAsync("/api/auth/login", new LoginRequest(email, password));
        loginRes.EnsureSuccessStatusCode();
        var loginData = await loginRes.Content.ReadFromJsonAsync<LoginResponse>();

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", loginData!.AccessToken);
        return (client, regData!.Id);
    }

    [Fact]
    public async Task GetProfile_WhenUnauthenticated_Returns401Unauthorized()
    {
        var client = CreateClient();

        var response = await client.GetAsync("/api/users/profile");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task UpdateProfile_WhenUnauthenticated_Returns401Unauthorized()
    {
        var client = CreateClient();

        var payload = new
        {
            PreferredCurrencyCode = "USD",
            DistanceUnit = DistanceUnit.Miles,
            DefaultVehicleName = "Honda CB500X",
            DefaultTankCapacityLitres = 17.5m,
            DefaultFuelEfficiencyKmPerLitre = 28m
        };

        var response = await client.PutAsJsonAsync("/api/users/profile", payload);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Registration_CreatesProfileAtomically_AndGetProfileReturnsDefaults()
    {
        var (client, _) = await CreateAuthenticatedClientAsync();

        var response = await client.GetAsync("/api/users/profile");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var profile = await response.Content.ReadFromJsonAsync<UserProfileDto>();
        Assert.NotNull(profile);
        Assert.Equal("INR", profile.PreferredCurrencyCode);
        Assert.Equal("Kilometers", profile.DistanceUnit);
        Assert.Null(profile.DefaultVehicleName);
        Assert.Null(profile.DefaultTankCapacityLitres);
        Assert.Null(profile.DefaultFuelEfficiencyKmPerLitre);
    }

    [Fact]
    public async Task UpdateProfile_WithValidData_Returns200AndPersists()
    {
        var (client, _) = await CreateAuthenticatedClientAsync();

        var updatePayload = new
        {
            PreferredCurrencyCode = "USD",
            DistanceUnit = DistanceUnit.Miles,
            DefaultVehicleName = "Yamaha Tenere 700",
            DefaultTankCapacityLitres = 16.0m,
            DefaultFuelEfficiencyKmPerLitre = 22.5m
        };

        var putResponse = await client.PutAsJsonAsync("/api/users/profile", updatePayload);

        Assert.Equal(HttpStatusCode.OK, putResponse.StatusCode);
        var updatedProfile = await putResponse.Content.ReadFromJsonAsync<UserProfileDto>();
        Assert.NotNull(updatedProfile);
        Assert.Equal("USD", updatedProfile.PreferredCurrencyCode);
        Assert.Equal("Miles", updatedProfile.DistanceUnit);
        Assert.Equal("Yamaha Tenere 700", updatedProfile.DefaultVehicleName);
        Assert.Equal(16.0m, updatedProfile.DefaultTankCapacityLitres);
        Assert.Equal(22.5m, updatedProfile.DefaultFuelEfficiencyKmPerLitre);

        // Fetch again to verify persistence
        var getResponse = await client.GetAsync("/api/users/profile");
        Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);
        var fetchedProfile = await getResponse.Content.ReadFromJsonAsync<UserProfileDto>();
        Assert.NotNull(fetchedProfile);
        Assert.Equal("USD", fetchedProfile.PreferredCurrencyCode);
        Assert.Equal("Miles", fetchedProfile.DistanceUnit);
        Assert.Equal("Yamaha Tenere 700", fetchedProfile.DefaultVehicleName);
    }

    [Theory]
    [InlineData("JPY")]
    [InlineData("AUD")]
    [InlineData("CAD")]
    [InlineData("")]
    public async Task UpdateProfile_WithInvalidCurrency_Returns400ProblemDetails(string invalidCurrency)
    {
        var (client, _) = await CreateAuthenticatedClientAsync();

        var updatePayload = new
        {
            PreferredCurrencyCode = invalidCurrency,
            DistanceUnit = DistanceUnit.Kilometers,
            DefaultVehicleName = (string?)null,
            DefaultTankCapacityLitres = (decimal?)null,
            DefaultFuelEfficiencyKmPerLitre = (decimal?)null
        };

        var response = await client.PutAsJsonAsync("/api/users/profile", updatePayload);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);
        var problem = await response.Content.ReadFromJsonAsync<ProblemDetails>();
        Assert.NotNull(problem);
        Assert.Equal(400, problem.Status);
    }

    [Theory]
    [InlineData(-5, 20)]      // negative tank
    [InlineData(1500, 20)]    // excessive tank > 1000
    [InlineData(15, -10)]     // negative mileage
    [InlineData(15, 250)]     // excessive mileage > 200
    public async Task UpdateProfile_WithInvalidVehicleMetrics_Returns400ProblemDetails(decimal tank, decimal mileage)
    {
        var (client, _) = await CreateAuthenticatedClientAsync();

        var updatePayload = new
        {
            PreferredCurrencyCode = "INR",
            DistanceUnit = DistanceUnit.Kilometers,
            DefaultVehicleName = "Test Bike",
            DefaultTankCapacityLitres = tank,
            DefaultFuelEfficiencyKmPerLitre = mileage
        };

        var response = await client.PutAsJsonAsync("/api/users/profile", updatePayload);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var problem = await response.Content.ReadFromJsonAsync<ProblemDetails>();
        Assert.NotNull(problem);
        Assert.Equal(400, problem.Status);
    }

    [Fact]
    public async Task Profiles_AreStrictlyIsolated_BetweenUsers()
    {
        // User A updates their profile to EUR / Miles
        var (clientA, _) = await CreateAuthenticatedClientAsync();
        var updatePayloadA = new
        {
            PreferredCurrencyCode = "EUR",
            DistanceUnit = DistanceUnit.Miles,
            DefaultVehicleName = "User A Moto",
            DefaultTankCapacityLitres = 18m,
            DefaultFuelEfficiencyKmPerLitre = 20m
        };
        var updateResA = await clientA.PutAsJsonAsync("/api/users/profile", updatePayloadA);
        Assert.Equal(HttpStatusCode.OK, updateResA.StatusCode);

        // User B registers fresh
        var (clientB, _) = await CreateAuthenticatedClientAsync();
        var getResB = await clientB.GetAsync("/api/users/profile");
        Assert.Equal(HttpStatusCode.OK, getResB.StatusCode);
        var profileB = await getResB.Content.ReadFromJsonAsync<UserProfileDto>();

        // User B must see their own default profile (INR / Kilometers), NOT User A's
        Assert.NotNull(profileB);
        Assert.Equal("INR", profileB.PreferredCurrencyCode);
        Assert.Equal("Kilometers", profileB.DistanceUnit);
        Assert.Null(profileB.DefaultVehicleName);
    }
}
