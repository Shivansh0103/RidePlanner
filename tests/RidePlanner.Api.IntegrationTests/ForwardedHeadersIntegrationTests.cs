using System.Net;
using System.Net.Http.Json;
using Xunit;

namespace RidePlanner.Api.IntegrationTests;

public class ConnectionInfoResponse
{
    public string? RemoteIp { get; set; }
    public string? Scheme { get; set; }
    public bool IsHttps { get; set; }
}

public class ForwardedHeadersIntegrationTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;

    public ForwardedHeadersIntegrationTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task ForwardedHeaders_WhenXForwardedForProvided_UpdatesRemoteIpAddress()
    {
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Add("X-Forwarded-For", "203.0.113.195");

        var response = await client.GetAsync("/api/test/connection-info");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var info = await response.Content.ReadFromJsonAsync<ConnectionInfoResponse>();
        Assert.NotNull(info);
        Assert.Equal("203.0.113.195", info.RemoteIp);
    }

    [Fact]
    public async Task ForwardedHeaders_WhenMultipleProxyHopsInXForwardedFor_ResolvesOriginatingClientIp()
    {
        var client = _factory.CreateClient();
        // Client IP: 203.0.113.195, Vercel Edge Proxy IP: 76.76.21.21
        client.DefaultRequestHeaders.Add("X-Forwarded-For", "203.0.113.195, 76.76.21.21");

        var response = await client.GetAsync("/api/test/connection-info");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var info = await response.Content.ReadFromJsonAsync<ConnectionInfoResponse>();
        Assert.NotNull(info);
        Assert.Equal("203.0.113.195", info.RemoteIp);
    }

    [Fact]
    public async Task ForwardedHeaders_WhenXForwardedProtoProvided_UpdatesSchemeToHttps()
    {
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Add("X-Forwarded-Proto", "https");

        var response = await client.GetAsync("/api/test/connection-info");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var info = await response.Content.ReadFromJsonAsync<ConnectionInfoResponse>();
        Assert.NotNull(info);
        Assert.Equal("https", info.Scheme);
        Assert.True(info.IsHttps);
    }
}
