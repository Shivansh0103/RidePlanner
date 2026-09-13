using System.Net;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using RidePlanner.Infrastructure.Persistence;
using Xunit;

namespace RidePlanner.Api.IntegrationTests;

public class HealthCheckEntryResponse
{
    public string Name { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}

public class HealthCheckResponse
{
    public string Status { get; set; } = string.Empty;
    public List<HealthCheckEntryResponse> Checks { get; set; } = [];
}

public class HealthCheckIntegrationTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;

    public HealthCheckIntegrationTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Healthz_ReturnsOk_AndHealthyStatus_WithoutDatabaseDependency()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync("/healthz");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("application/json", response.Content.Headers.ContentType?.MediaType);

        var payload = await response.Content.ReadFromJsonAsync<HealthCheckResponse>();
        Assert.NotNull(payload);
        Assert.Equal("Healthy", payload.Status);
        Assert.Contains(payload.Checks, c => c.Name == "self" && c.Status == "Healthy");
        Assert.DoesNotContain(payload.Checks, c => c.Name == "database");
    }

    [Fact]
    public async Task Readyz_ReturnsOk_WhenDatabaseIsAvailable()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync("/readyz");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("application/json", response.Content.Headers.ContentType?.MediaType);

        var payload = await response.Content.ReadFromJsonAsync<HealthCheckResponse>();
        Assert.NotNull(payload);
        Assert.Equal("Healthy", payload.Status);
        Assert.Contains(payload.Checks, c => c.Name == "database" && c.Status == "Healthy");
        Assert.DoesNotContain(payload.Checks, c => c.Name == "self");
    }

    [Fact]
    public async Task Readyz_ReturnsServiceUnavailable_WhenDatabaseIsUnavailable()
    {
        var client = _factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                services.RemoveAll<DbContextOptions<RidePlannerDbContext>>();
                services.RemoveAll<RidePlannerDbContext>();

                services.AddDbContext<RidePlannerDbContext>(options =>
                {
                    options.UseNpgsql("Host=127.0.0.1;Port=54329;Database=rideplanner_down;Username=postgres;Password=super_secret_db_password_123;Timeout=1;CommandTimeout=1");
                });
            });
        }).CreateClient();

        var response = await client.GetAsync("/readyz");

        Assert.Equal(HttpStatusCode.ServiceUnavailable, response.StatusCode);
        Assert.Equal("application/json", response.Content.Headers.ContentType?.MediaType);

        var payload = await response.Content.ReadFromJsonAsync<HealthCheckResponse>();
        Assert.NotNull(payload);
        Assert.Equal("Unhealthy", payload.Status);
        Assert.Contains(payload.Checks, c => c.Name == "database" && c.Status == "Unhealthy");
    }

    [Fact]
    public async Task HealthEndpoints_DoNotRequireAuthentication()
    {
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = null;

        var healthzResponse = await client.GetAsync("/healthz");
        var readyzResponse = await client.GetAsync("/readyz");

        Assert.NotEqual(HttpStatusCode.Unauthorized, healthzResponse.StatusCode);
        Assert.NotEqual(HttpStatusCode.Forbidden, healthzResponse.StatusCode);
        Assert.Equal(HttpStatusCode.OK, healthzResponse.StatusCode);

        Assert.NotEqual(HttpStatusCode.Unauthorized, readyzResponse.StatusCode);
        Assert.NotEqual(HttpStatusCode.Forbidden, readyzResponse.StatusCode);
        Assert.Equal(HttpStatusCode.OK, readyzResponse.StatusCode);
    }

    [Fact]
    public async Task HealthEndpoints_DoNotExposeSensitiveDiagnosticDetails()
    {
        const string secretPassword = "super_secret_db_password_xyz";
        const string secretPort = "54329";

        var client = _factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                services.RemoveAll<DbContextOptions<RidePlannerDbContext>>();
                services.RemoveAll<RidePlannerDbContext>();

                services.AddDbContext<RidePlannerDbContext>(options =>
                {
                    options.UseNpgsql($"Host=127.0.0.1;Port={secretPort};Database=rideplanner_down;Username=postgres;Password={secretPassword};Timeout=1;CommandTimeout=1");
                });
            });
        }).CreateClient();

        var readyzResponse = await client.GetAsync("/readyz");
        var rawBody = await readyzResponse.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.ServiceUnavailable, readyzResponse.StatusCode);
        Assert.DoesNotContain(secretPassword, rawBody, StringComparison.OrdinalIgnoreCase);
        Assert.DoesNotContain(secretPort, rawBody, StringComparison.OrdinalIgnoreCase);
        Assert.DoesNotContain("NpgsqlException", rawBody, StringComparison.OrdinalIgnoreCase);
        Assert.DoesNotContain("SocketException", rawBody, StringComparison.OrdinalIgnoreCase);
        Assert.DoesNotContain("Connection refused", rawBody, StringComparison.OrdinalIgnoreCase);
        Assert.DoesNotContain("Exception", rawBody, StringComparison.OrdinalIgnoreCase);
        Assert.DoesNotContain("StackTrace", rawBody, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task Healthz_RemainsHealthy_EvenWhenDatabaseIsDown()
    {
        var client = _factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                services.RemoveAll<DbContextOptions<RidePlannerDbContext>>();
                services.RemoveAll<RidePlannerDbContext>();

                services.AddDbContext<RidePlannerDbContext>(options =>
                {
                    options.UseNpgsql("Host=127.0.0.1;Port=54329;Database=rideplanner_down;Username=postgres;Password=test;Timeout=1;CommandTimeout=1");
                });
            });
        }).CreateClient();

        var healthzResponse = await client.GetAsync("/healthz");

        Assert.Equal(HttpStatusCode.OK, healthzResponse.StatusCode);
        var payload = await healthzResponse.Content.ReadFromJsonAsync<HealthCheckResponse>();
        Assert.NotNull(payload);
        Assert.Equal("Healthy", payload.Status);
    }
}
