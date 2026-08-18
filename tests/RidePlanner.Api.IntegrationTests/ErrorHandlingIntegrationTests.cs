using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc;

namespace RidePlanner.Api.IntegrationTests;

public class ErrorHandlingIntegrationTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public ErrorHandlingIntegrationTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task CreateTrip_With_Empty_Name_Returns_400_ValidationProblemDetails()
    {
        // Arrange: Invalid payload with empty name
        var invalidTrip = new
        {
            Name = "",
            Description = "Invalid trip",
            StartDate = "2026-08-01",
            EndDate = "2026-08-10"
        };

        // Act: POST /api/trips
        var response = await _client.PostAsJsonAsync("/api/trips", invalidTrip);

        // Assert: 400 Bad Request
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);

        var problemDetails = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();
        Assert.NotNull(problemDetails);
        Assert.Equal(400, problemDetails.Status);
        Assert.True(problemDetails.Errors.ContainsKey("Name"));
    }

    [Fact]
    public async Task CreateTripStop_For_NonExistent_Trip_Returns_404_NotFound_ProblemDetails()
    {
        // Arrange: Non-existent TripId
        var nonExistentTripId = Guid.NewGuid();
        var newStop = new
        {
            TripId = nonExistentTripId,
            Name = "Manali Cafe",
            FormattedAddress = "Mall Road, Manali",
            Category = 0,
            ArrivalDate = "2026-08-05",
            DepartureDate = "2026-08-06",
            DisplayOrder = 1
        };

        // Act: POST /api/trips/{tripId}/stops
        var response = await _client.PostAsJsonAsync($"/api/trips/{nonExistentTripId}/stops", newStop);

        // Assert: 404 Not Found
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);

        var problemDetails = await response.Content.ReadFromJsonAsync<ProblemDetails>();
        Assert.NotNull(problemDetails);
        Assert.Equal(404, problemDetails.Status);
        Assert.Equal("Not Found", problemDetails.Title);
    }
}
