using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using RidePlanner.Application.Features.Auth.DTOs;
using RidePlanner.Application.Features.Trips.DTOs;
using RidePlanner.Application.Features.TripStops.DTOs;

namespace RidePlanner.Api.IntegrationTests;

public class TripOwnershipIntegrationTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;

    public TripOwnershipIntegrationTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
    }

    private async Task<(HttpClient Client, Guid UserId)> CreateAuthenticatedClientAsync()
    {
        var client = _factory.CreateClient();
        var email = $"user_{Guid.NewGuid():N}@example.com";
        var password = "SecurePassword123!";

        var registerRes = await client.PostAsJsonAsync("/api/auth/register", new RegisterRequest(email, password));
        registerRes.EnsureSuccessStatusCode();

        var loginRes = await client.PostAsJsonAsync("/api/auth/login", new LoginRequest(email, password));
        loginRes.EnsureSuccessStatusCode();

        var loginData = await loginRes.Content.ReadFromJsonAsync<LoginResponse>();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", loginData!.AccessToken);

        return (client, loginData.UserId);
    }

    [Fact]
    public async Task Unauthenticated_Requests_To_Trip_Endpoints_Return_401Unauthorized()
    {
        var client = _factory.CreateClient();
        var tripId = Guid.NewGuid();

        var endpoints = new[]
        {
            HttpMethod.Get.Method + " /api/trips",
            HttpMethod.Post.Method + " /api/trips",
            HttpMethod.Get.Method + $" /api/trips/{tripId}",
            HttpMethod.Put.Method + $" /api/trips/{tripId}",
            HttpMethod.Delete.Method + $" /api/trips/{tripId}",
            HttpMethod.Post.Method + $" /api/trips/{tripId}/start",
            HttpMethod.Post.Method + $" /api/trips/{tripId}/complete",
            HttpMethod.Get.Method + $" /api/trips/{tripId}/stops",
            HttpMethod.Get.Method + $" /api/trips/{tripId}/budget",
            HttpMethod.Get.Method + $" /api/trips/{tripId}/expenses",
            HttpMethod.Get.Method + $" /api/trips/{tripId}/checklist",
            HttpMethod.Get.Method + $" /api/trips/{tripId}/documents",
            HttpMethod.Get.Method + $" /api/trips/{tripId}/contacts",
            HttpMethod.Get.Method + $" /api/trips/{tripId}/memories",
            HttpMethod.Get.Method + $" /api/trips/{tripId}/accommodations",
            HttpMethod.Get.Method + $" /api/trips/{tripId}/readiness",
            HttpMethod.Get.Method + $" /api/trips/{tripId}/summary"
        };

        foreach (var endpoint in endpoints)
        {
            var parts = endpoint.Split(' ');
            var request = new HttpRequestMessage(new HttpMethod(parts[0]), parts[1]);
            if (parts[0] == "POST" || parts[0] == "PUT")
            {
                request.Content = JsonContent.Create(new { Name = "Test" });
            }

            var response = await client.SendAsync(request);
            Assert.True(response.StatusCode == HttpStatusCode.Unauthorized, $"Expected 401 for {endpoint} but got {response.StatusCode}");
        }
    }

    [Fact]
    public async Task Authenticated_User_Can_Create_And_Read_Own_Trip()
    {
        var (client, _) = await CreateAuthenticatedClientAsync();

        // 1. Create Trip
        var createPayload = new
        {
            Name = "Owner Adventure",
            Description = "My private trip",
            StartDate = "2026-09-01",
            EndDate = "2026-09-10"
        };
        var createRes = await client.PostAsJsonAsync("/api/trips", createPayload);
        Assert.Equal(HttpStatusCode.Created, createRes.StatusCode);

        var created = await createRes.Content.ReadFromJsonAsync<TripResponse>();
        Assert.NotNull(created);
        Assert.Equal("Owner Adventure", created.Name);

        // 2. Read Trip by Id
        var getRes = await client.GetAsync($"/api/trips/{created.Id}");
        Assert.Equal(HttpStatusCode.OK, getRes.StatusCode);

        var fetched = await getRes.Content.ReadFromJsonAsync<TripResponse>();
        Assert.NotNull(fetched);
        Assert.Equal(created.Id, fetched.Id);

        // 3. Read All Trips
        var listRes = await client.GetAsync("/api/trips");
        Assert.Equal(HttpStatusCode.OK, listRes.StatusCode);

        var list = await listRes.Content.ReadFromJsonAsync<List<TripResponse>>();
        Assert.NotNull(list);
        Assert.Contains(list, t => t.Id == created.Id);
    }

    [Fact]
    public async Task Cross_User_Access_To_Trips_Returns_404NotFound()
    {
        var (userAClient, _) = await CreateAuthenticatedClientAsync();
        var (userBClient, _) = await CreateAuthenticatedClientAsync();

        // User A creates trip
        var createPayload = new
        {
            Name = "User A Private Trip",
            Description = "Secret",
            StartDate = "2026-10-01",
            EndDate = "2026-10-15"
        };
        var createRes = await userAClient.PostAsJsonAsync("/api/trips", createPayload);
        Assert.Equal(HttpStatusCode.Created, createRes.StatusCode);
        var trip = await createRes.Content.ReadFromJsonAsync<TripResponse>();
        Assert.NotNull(trip);

        // User B attempts to read User A's trip -> 404
        var getRes = await userBClient.GetAsync($"/api/trips/{trip.Id}");
        Assert.Equal(HttpStatusCode.NotFound, getRes.StatusCode);

        // User B attempts to update User A's trip -> 404
        var updatePayload = new
        {
            Name = "Hacked Name",
            Description = "Hacked",
            StartDate = "2026-10-01",
            EndDate = "2026-10-15"
        };
        var updateRes = await userBClient.PutAsJsonAsync($"/api/trips/{trip.Id}", updatePayload);
        Assert.Equal(HttpStatusCode.NotFound, updateRes.StatusCode);

        // User B attempts to start User A's trip -> 404
        var startRes = await userBClient.PostAsJsonAsync($"/api/trips/{trip.Id}/start", new { ActualStartedAt = DateTimeOffset.UtcNow });
        Assert.Equal(HttpStatusCode.NotFound, startRes.StatusCode);

        // User B attempts to complete User A's trip -> 404
        var completeRes = await userBClient.PostAsJsonAsync($"/api/trips/{trip.Id}/complete", new { ActualCompletedAt = DateTimeOffset.UtcNow });
        Assert.Equal(HttpStatusCode.NotFound, completeRes.StatusCode);

        // User B attempts to delete User A's trip -> 404
        var deleteRes = await userBClient.DeleteAsync($"/api/trips/{trip.Id}");
        Assert.Equal(HttpStatusCode.NotFound, deleteRes.StatusCode);

        // User B's trip list does not include User A's trip
        var userBListRes = await userBClient.GetAsync("/api/trips");
        var userBList = await userBListRes.Content.ReadFromJsonAsync<List<TripResponse>>();
        Assert.NotNull(userBList);
        Assert.DoesNotContain(userBList, t => t.Id == trip.Id);
    }

    [Fact]
    public async Task Cross_User_Access_To_Nested_Trip_Resources_Returns_404NotFound()
    {
        var (userAClient, _) = await CreateAuthenticatedClientAsync();
        var (userBClient, _) = await CreateAuthenticatedClientAsync();

        // User A creates trip
        var createPayload = new
        {
            Name = "Parent Trip For Nested Check",
            Description = "Isolated",
            StartDate = "2026-11-01",
            EndDate = "2026-11-10"
        };
        var createRes = await userAClient.PostAsJsonAsync("/api/trips", createPayload);
        var trip = await createRes.Content.ReadFromJsonAsync<TripResponse>();
        Assert.NotNull(trip);

        // User B accesses nested resources of User A's trip -> all 404
        var stopRes = await userBClient.GetAsync($"/api/trips/{trip.Id}/stops");
        Assert.Equal(HttpStatusCode.NotFound, stopRes.StatusCode);

        var budgetRes = await userBClient.GetAsync($"/api/trips/{trip.Id}/budget");
        Assert.Equal(HttpStatusCode.NotFound, budgetRes.StatusCode);

        var expenseRes = await userBClient.GetAsync($"/api/trips/{trip.Id}/expenses");
        Assert.Equal(HttpStatusCode.NotFound, expenseRes.StatusCode);

        var checklistRes = await userBClient.GetAsync($"/api/trips/{trip.Id}/checklist");
        Assert.Equal(HttpStatusCode.NotFound, checklistRes.StatusCode);

        var docRes = await userBClient.GetAsync($"/api/trips/{trip.Id}/documents");
        Assert.Equal(HttpStatusCode.NotFound, docRes.StatusCode);

        var contactRes = await userBClient.GetAsync($"/api/trips/{trip.Id}/contacts");
        Assert.Equal(HttpStatusCode.NotFound, contactRes.StatusCode);

        var memoryRes = await userBClient.GetAsync($"/api/trips/{trip.Id}/memories");
        Assert.Equal(HttpStatusCode.NotFound, memoryRes.StatusCode);

        var accommodationRes = await userBClient.GetAsync($"/api/trips/{trip.Id}/accommodations");
        Assert.Equal(HttpStatusCode.NotFound, accommodationRes.StatusCode);

        var readinessRes = await userBClient.GetAsync($"/api/trips/{trip.Id}/readiness");
        Assert.Equal(HttpStatusCode.NotFound, readinessRes.StatusCode);

        var summaryRes = await userBClient.GetAsync($"/api/trips/{trip.Id}/summary");
        Assert.Equal(HttpStatusCode.NotFound, summaryRes.StatusCode);
    }

    [Fact]
    public async Task Child_Resource_Parent_TripId_Mismatch_Returns_404NotFound()
    {
        var (client, _) = await CreateAuthenticatedClientAsync();

        // 1. User creates Trip 1
        var trip1Res = await client.PostAsJsonAsync("/api/trips", new
        {
            Name = "Trip One",
            Description = "Trip 1",
            StartDate = "2026-12-01",
            EndDate = "2026-12-05"
        });
        var trip1 = await trip1Res.Content.ReadFromJsonAsync<TripResponse>();
        Assert.NotNull(trip1);

        // 2. User creates Trip 2
        var trip2Res = await client.PostAsJsonAsync("/api/trips", new
        {
            Name = "Trip Two",
            Description = "Trip 2",
            StartDate = "2026-12-10",
            EndDate = "2026-12-15"
        });
        var trip2 = await trip2Res.Content.ReadFromJsonAsync<TripResponse>();
        Assert.NotNull(trip2);

        // 3. User creates a Stop on Trip 1
        var createStopRes = await client.PostAsJsonAsync($"/api/trips/{trip1.Id}/stops", new
        {
            TripId = trip1.Id,
            Name = "Trip 1 Stop",
            FormattedAddress = "Trip 1 Address",
            Category = 0,
            ArrivalDate = "2026-12-01",
            DepartureDate = "2026-12-02",
            DisplayOrder = 1
        });
        Assert.Equal(HttpStatusCode.Created, createStopRes.StatusCode);
        var stopId = await createStopRes.Content.ReadFromJsonAsync<Guid>();
        Assert.NotEqual(Guid.Empty, stopId);

        // 4. User attempts to update Trip 1's Stop using Trip 2's URL -> 404
        var mismatchedUpdateRes = await client.PutAsJsonAsync($"/api/trips/{trip2.Id}/stops/{stopId}", new
        {
            Name = "Mismatched Update",
            FormattedAddress = "Trip 1 Address",
            Category = 0,
            ArrivalDate = "2026-12-01",
            DepartureDate = "2026-12-02",
            DisplayOrder = 1
        });
        Assert.Equal(HttpStatusCode.NotFound, mismatchedUpdateRes.StatusCode);

        // 5. User attempts to delete Trip 1's Stop using Trip 2's URL -> 404
        var mismatchedDeleteRes = await client.DeleteAsync($"/api/trips/{trip2.Id}/stops/{stopId}");
        Assert.Equal(HttpStatusCode.NotFound, mismatchedDeleteRes.StatusCode);
    }
}
