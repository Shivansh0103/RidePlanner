using System.Net;
using System.Net.Http.Json;
using RidePlanner.Application.Features.Trips.DTOs;

namespace RidePlanner.Api.IntegrationTests;

public class TripsEndpointIntegrationTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public TripsEndpointIntegrationTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task CreateTrip_Returns_Created_And_GetTrip_Returns_Trip()
    {
        // 1. Arrange: Prepare CreateTrip payload
        var newTrip = new
        {
            Name = "Ladakh Highway Expedition",
            Description = "Road trip to Khardung La",
            StartDate = "2026-08-01",
            EndDate = "2026-08-15"
        };

        // 2. Act: POST /api/trips
        var createResponse = await _client.PostAsJsonAsync("/api/trips", newTrip);

        // 3. Assert: 201 Created
        Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);
        var createdTrip = await createResponse.Content.ReadFromJsonAsync<TripResponse>();
        Assert.NotNull(createdTrip);
        Assert.Equal("Ladakh Highway Expedition", createdTrip.Name);
        Assert.Equal("Planning", createdTrip.Status);

        // 4. Act: GET /api/trips/{id}
        var getResponse = await _client.GetAsync($"/api/trips/{createdTrip.Id}");

        // 5. Assert: 200 OK
        Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);
        var fetchedTrip = await getResponse.Content.ReadFromJsonAsync<TripResponse>();
        Assert.NotNull(fetchedTrip);
        Assert.Equal(createdTrip.Id, fetchedTrip.Id);
        Assert.Equal("Ladakh Highway Expedition", fetchedTrip.Name);
    }

    [Fact]
    public async Task GetTrips_Returns_Ok_List()
    {
        var response = await _client.GetAsync("/api/trips");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}
