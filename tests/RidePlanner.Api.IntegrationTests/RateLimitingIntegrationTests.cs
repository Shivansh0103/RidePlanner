using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using RidePlanner.Api.Common;
using RidePlanner.Application.Features.Auth.DTOs;

namespace RidePlanner.Api.IntegrationTests;

public class RateLimitingWebApplicationFactory : CustomWebApplicationFactory
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        base.ConfigureWebHost(builder);
        builder.ConfigureServices(services =>
        {
            services.Configure<RateLimitingSettings>(options =>
            {
                options.Login.PermitLimit = 3;
                options.Login.WindowSeconds = 60;

                options.Register.PermitLimit = 2;
                options.Register.WindowSeconds = 60;

                options.ForgotPassword.PermitLimit = 2;
                options.ForgotPassword.WindowSeconds = 60;

                options.ResetPassword.PermitLimit = 2;
                options.ResetPassword.WindowSeconds = 60;

                options.ExternalLink.PermitLimit = 2;
                options.ExternalLink.WindowSeconds = 60;
            });
        });
    }
}

public class RateLimitingIntegrationTests : IClassFixture<RateLimitingWebApplicationFactory>
{
    private readonly RateLimitingWebApplicationFactory _factory;

    public RateLimitingIntegrationTests(RateLimitingWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Login_WhenPermitLimitExceeded_Returns429TooManyRequests_WithRetryAfter_AndProblemDetails()
    {
        var client = _factory.CreateClient();
        var clientIp = $"192.168.10.{Guid.NewGuid():N}";
        client.DefaultRequestHeaders.Add("X-Test-Client-IP", clientIp);

        var loginPayload = new LoginRequest("someone@example.com", "WrongPassword123!");

        // PermitLimit is 3: first 3 requests return 401 Unauthorized (normal failure, not throttled)
        for (var i = 0; i < 3; i++)
        {
            var response = await client.PostAsJsonAsync("/api/auth/login", loginPayload);
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        // 4th request exceeds permit limit -> 429 Too Many Requests
        var throttledResponse = await client.PostAsJsonAsync("/api/auth/login", loginPayload);
        Assert.Equal(HttpStatusCode.TooManyRequests, throttledResponse.StatusCode);
        Assert.Equal("application/problem+json", throttledResponse.Content.Headers.ContentType?.MediaType);
        Assert.NotNull(throttledResponse.Headers.RetryAfter);

        var problemDetails = await throttledResponse.Content.ReadFromJsonAsync<ProblemDetails>();
        Assert.NotNull(problemDetails);
        Assert.Equal(StatusCodes.Status429TooManyRequests, problemDetails.Status);
        Assert.Equal("Too Many Requests", problemDetails.Title);
        Assert.Contains("Too many requests", problemDetails.Detail);
    }

    [Fact]
    public async Task Login_WithDifferentClientIps_MaintainsSeparateRateLimitPartitions()
    {
        var clientA = _factory.CreateClient();
        var clientB = _factory.CreateClient();

        var ipA = $"10.10.1.{Guid.NewGuid():N}";
        var ipB = $"10.10.2.{Guid.NewGuid():N}";

        clientA.DefaultRequestHeaders.Add("X-Test-Client-IP", ipA);
        clientB.DefaultRequestHeaders.Add("X-Test-Client-IP", ipB);

        var loginPayload = new LoginRequest("someone@example.com", "WrongPassword123!");

        // Exhaust limit for IP A (3 attempts)
        for (var i = 0; i < 3; i++)
        {
            var resA = await clientA.PostAsJsonAsync("/api/auth/login", loginPayload);
            Assert.Equal(HttpStatusCode.Unauthorized, resA.StatusCode);
        }

        // IP A is now throttled
        var throttledA = await clientA.PostAsJsonAsync("/api/auth/login", loginPayload);
        Assert.Equal(HttpStatusCode.TooManyRequests, throttledA.StatusCode);

        // IP B must NOT be throttled (independent partition)
        var responseB = await clientB.PostAsJsonAsync("/api/auth/login", loginPayload);
        Assert.Equal(HttpStatusCode.Unauthorized, responseB.StatusCode);
    }

    [Fact]
    public async Task Register_WhenPermitLimitExceeded_Returns429TooManyRequests()
    {
        var client = _factory.CreateClient();
        var clientIp = $"192.168.20.{Guid.NewGuid():N}";
        client.DefaultRequestHeaders.Add("X-Test-Client-IP", clientIp);

        // PermitLimit is 2: first 2 requests succeed
        for (var i = 0; i < 2; i++)
        {
            var regPayload = new RegisterRequest($"reg_{Guid.NewGuid():N}@example.com", "StrongPass123!");
            var res = await client.PostAsJsonAsync("/api/auth/register", regPayload);
            Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        }

        // 3rd request exceeds permit limit -> 429 Too Many Requests
        var excessPayload = new RegisterRequest($"reg_{Guid.NewGuid():N}@example.com", "StrongPass123!");
        var throttledResponse = await client.PostAsJsonAsync("/api/auth/register", excessPayload);
        Assert.Equal(HttpStatusCode.TooManyRequests, throttledResponse.StatusCode);

        var problemDetails = await throttledResponse.Content.ReadFromJsonAsync<ProblemDetails>();
        Assert.NotNull(problemDetails);
        Assert.Equal(StatusCodes.Status429TooManyRequests, problemDetails.Status);
    }

    [Fact]
    public async Task ForgotPassword_WhenPermitLimitExceeded_Returns429TooManyRequests()
    {
        var client = _factory.CreateClient();
        var clientIp = $"192.168.30.{Guid.NewGuid():N}";
        client.DefaultRequestHeaders.Add("X-Test-Client-IP", clientIp);

        var forgotPayload = new ForgotPasswordRequest("user@example.com");

        // PermitLimit is 2: first 2 requests return 200 OK
        for (var i = 0; i < 2; i++)
        {
            var res = await client.PostAsJsonAsync("/api/auth/forgot-password", forgotPayload);
            Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        }

        // 3rd request exceeds limit -> 429 Too Many Requests
        var throttledResponse = await client.PostAsJsonAsync("/api/auth/forgot-password", forgotPayload);
        Assert.Equal(HttpStatusCode.TooManyRequests, throttledResponse.StatusCode);
    }

    [Fact]
    public async Task ResetPassword_WhenPermitLimitExceeded_Returns429TooManyRequests()
    {
        var client = _factory.CreateClient();
        var clientIp = $"192.168.40.{Guid.NewGuid():N}";
        client.DefaultRequestHeaders.Add("X-Test-Client-IP", clientIp);

        var resetPayload = new ResetPasswordRequest(Guid.NewGuid(), "invalid-token", "NewStrongPass123!");

        // PermitLimit is 2: first 2 requests fail with 400 Bad Request (invalid token)
        for (var i = 0; i < 2; i++)
        {
            var res = await client.PostAsJsonAsync("/api/auth/reset-password", resetPayload);
            Assert.Equal(HttpStatusCode.BadRequest, res.StatusCode);
        }

        // 3rd request exceeds limit -> 429 Too Many Requests
        var throttledResponse = await client.PostAsJsonAsync("/api/auth/reset-password", resetPayload);
        Assert.Equal(HttpStatusCode.TooManyRequests, throttledResponse.StatusCode);
    }

    [Fact]
    public async Task ExternalLinkInfo_WhenPermitLimitExceeded_Returns429TooManyRequests()
    {
        var client = _factory.CreateClient();
        var clientIp = $"192.168.50.{Guid.NewGuid():N}";
        client.DefaultRequestHeaders.Add("X-Test-Client-IP", clientIp);

        // PermitLimit is 2: first 2 requests return 401 Unauthorized (invalid ticket)
        for (var i = 0; i < 2; i++)
        {
            var res = await client.GetAsync("/api/auth/external/link-info?ticket=invalid-ticket-payload");
            Assert.Equal(HttpStatusCode.Unauthorized, res.StatusCode);
        }

        // 3rd request exceeds limit -> 429 Too Many Requests
        var throttledResponse = await client.GetAsync("/api/auth/external/link-info?ticket=invalid-ticket-payload");
        Assert.Equal(HttpStatusCode.TooManyRequests, throttledResponse.StatusCode);
    }

    [Fact]
    public async Task ExternalLink_WhenPermitLimitExceeded_Returns429TooManyRequests()
    {
        var client = _factory.CreateClient();
        var clientIp = $"192.168.60.{Guid.NewGuid():N}";
        client.DefaultRequestHeaders.Add("X-Test-Client-IP", clientIp);

        var linkPayload = new LinkExternalAccountRequest("invalid-link-ticket", "Password123!");

        // PermitLimit is 2: first 2 requests return 401 Unauthorized (invalid ticket)
        for (var i = 0; i < 2; i++)
        {
            var res = await client.PostAsJsonAsync("/api/auth/external/link", linkPayload);
            Assert.Equal(HttpStatusCode.Unauthorized, res.StatusCode);
        }

        // 3rd request exceeds limit -> 429 Too Many Requests
        var throttledResponse = await client.PostAsJsonAsync("/api/auth/external/link", linkPayload);
        Assert.Equal(HttpStatusCode.TooManyRequests, throttledResponse.StatusCode);
    }
}
