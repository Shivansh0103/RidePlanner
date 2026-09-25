using System.Net;
using Xunit;

namespace RidePlanner.Api.IntegrationTests;

public class SecurityHeadersIntegrationTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;

    public SecurityHeadersIntegrationTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Responses_IncludeDefensiveSecurityHeaders()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync("/health");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.True(response.Headers.Contains("X-Content-Type-Options"), "Response should include X-Content-Type-Options");
        Assert.Equal("nosniff", response.Headers.GetValues("X-Content-Type-Options").FirstOrDefault());

        Assert.True(response.Headers.Contains("X-Frame-Options"), "Response should include X-Frame-Options");
        Assert.Equal("DENY", response.Headers.GetValues("X-Frame-Options").FirstOrDefault());

        Assert.True(response.Headers.Contains("Referrer-Policy"), "Response should include Referrer-Policy");
        Assert.Equal("strict-origin-when-cross-origin", response.Headers.GetValues("Referrer-Policy").FirstOrDefault());

        Assert.True(response.Headers.Contains("Permissions-Policy"), "Response should include Permissions-Policy");
        Assert.Equal("geolocation=(), camera=(), microphone=()", response.Headers.GetValues("Permissions-Policy").FirstOrDefault());
    }

    [Fact]
    public async Task ErrorResponses_AlsoIncludeDefensiveSecurityHeaders()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/non-existent-endpoint");

        Assert.True(response.Headers.Contains("X-Content-Type-Options"));
        Assert.True(response.Headers.Contains("X-Frame-Options"));
        Assert.True(response.Headers.Contains("Referrer-Policy"));
        Assert.True(response.Headers.Contains("Permissions-Policy"));
    }
}
