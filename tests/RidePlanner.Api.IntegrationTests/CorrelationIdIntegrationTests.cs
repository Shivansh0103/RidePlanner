using System.Collections.Concurrent;
using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using RidePlanner.Api.Middleware;
using Xunit;

namespace RidePlanner.Api.IntegrationTests;

public class EchoCorrelationIdResponse
{
    public string? CorrelationId { get; set; }
}

public class TestLogRecord
{
    public LogLevel LogLevel { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public List<object?> Scopes { get; set; } = [];
}

public class TestSinkLoggerProvider : ILoggerProvider, ISupportExternalScope
{
    private IExternalScopeProvider? _scopeProvider;
    public ConcurrentBag<TestLogRecord> Records { get; } = new();

    public ILogger CreateLogger(string categoryName) => new TestSinkLogger(categoryName, this);

    public void SetScopeProvider(IExternalScopeProvider scopeProvider)
    {
        _scopeProvider = scopeProvider;
    }

    public IExternalScopeProvider? ScopeProvider => _scopeProvider;

    public void Dispose() { }

    private class TestSinkLogger : ILogger
    {
        private readonly string _category;
        private readonly TestSinkLoggerProvider _provider;

        public TestSinkLogger(string category, TestSinkLoggerProvider provider)
        {
            _category = category;
            _provider = provider;
        }

        public IDisposable? BeginScope<TState>(TState state) where TState : notnull
        {
            return _provider._scopeProvider?.Push(state);
        }

        public bool IsEnabled(LogLevel logLevel) => true;

        public void Log<TState>(
            LogLevel logLevel,
            EventId eventId,
            TState state,
            Exception? exception,
            Func<TState, Exception?, string> formatter)
        {
            var record = new TestLogRecord
            {
                LogLevel = logLevel,
                Category = _category,
                Message = formatter(state, exception)
            };

            _provider._scopeProvider?.ForEachScope((scope, list) =>
            {
                list.Add(scope);
            }, record.Scopes);

            _provider.Records.Add(record);
        }
    }
}

public class CorrelationIdIntegrationTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;

    public CorrelationIdIntegrationTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task CorrelationId_WhenHeaderMissing_GeneratesValidGuidCorrelationId()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/test/echo-correlation-id");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.True(response.Headers.Contains(CorrelationIdMiddleware.HeaderName));

        var correlationId = response.Headers.GetValues(CorrelationIdMiddleware.HeaderName).FirstOrDefault();
        Assert.NotNull(correlationId);
        Assert.True(Guid.TryParse(correlationId, out _));

        var body = await response.Content.ReadFromJsonAsync<EchoCorrelationIdResponse>();
        Assert.NotNull(body);
        Assert.Equal(correlationId, body.CorrelationId);
    }

    [Fact]
    public async Task CorrelationId_WhenHeaderProvidedAndValid_PreservesCorrelationId()
    {
        var client = _factory.CreateClient();
        const string incomingId = "custom-trace-req_123.45:test";
        client.DefaultRequestHeaders.Add(CorrelationIdMiddleware.HeaderName, incomingId);

        var response = await client.GetAsync("/api/test/echo-correlation-id");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.True(response.Headers.Contains(CorrelationIdMiddleware.HeaderName));

        var returnedId = response.Headers.GetValues(CorrelationIdMiddleware.HeaderName).FirstOrDefault();
        Assert.Equal(incomingId, returnedId);

        var body = await response.Content.ReadFromJsonAsync<EchoCorrelationIdResponse>();
        Assert.NotNull(body);
        Assert.Equal(incomingId, body.CorrelationId);
    }

    [Theory]
    [InlineData("invalid spaces in header")]
    [InlineData("invalid<script>alert(1)</script>")]
    [InlineData("invalid\r\nCRLFInjection: true")]
    [InlineData("invalid\"quote\"")]
    public async Task CorrelationId_WhenHeaderContainsInvalidChars_GeneratesNewIdAndDoesNotLeakInvalidValue(string invalidHeader)
    {
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.TryAddWithoutValidation(CorrelationIdMiddleware.HeaderName, invalidHeader);

        var response = await client.GetAsync("/api/test/echo-correlation-id");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var returnedId = response.Headers.GetValues(CorrelationIdMiddleware.HeaderName).FirstOrDefault();
        Assert.NotNull(returnedId);

        // Must NOT match the invalid header
        Assert.NotEqual(invalidHeader, returnedId);

        // Must be a valid generated GUID
        Assert.True(Guid.TryParse(returnedId, out _));

        // Invalid raw string must never be returned in headers or body
        var rawBody = await response.Content.ReadAsStringAsync();
        Assert.DoesNotContain(invalidHeader, rawBody, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task CorrelationId_WhenHeaderOversized_GeneratesNewIdAndDoesNotLeakInvalidValue()
    {
        var client = _factory.CreateClient();
        var oversizedId = new string('a', 129); // MaxLength is 128
        client.DefaultRequestHeaders.TryAddWithoutValidation(CorrelationIdMiddleware.HeaderName, oversizedId);

        var response = await client.GetAsync("/api/test/echo-correlation-id");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var returnedId = response.Headers.GetValues(CorrelationIdMiddleware.HeaderName).FirstOrDefault();
        Assert.NotNull(returnedId);

        Assert.NotEqual(oversizedId, returnedId);
        Assert.True(Guid.TryParse(returnedId, out _));

        var rawBody = await response.Content.ReadAsStringAsync();
        Assert.DoesNotContain(oversizedId, rawBody, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task CorrelationId_ResponseHeader_MatchesRequestScope()
    {
        var client = _factory.CreateClient();
        const string correlationId = "trace-req-scope-match-12345";
        client.DefaultRequestHeaders.Add(CorrelationIdMiddleware.HeaderName, correlationId);

        var response = await client.GetAsync("/api/test/echo-correlation-id");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var headerId = response.Headers.GetValues(CorrelationIdMiddleware.HeaderName).Single();
        var body = await response.Content.ReadFromJsonAsync<EchoCorrelationIdResponse>();

        Assert.NotNull(body);
        Assert.Equal(correlationId, headerId);
        Assert.Equal(correlationId, body.CorrelationId);
    }

    [Fact]
    public async Task CorrelationId_StructuredLogs_ContainCorrelationIdProperty()
    {
        var testSink = new TestSinkLoggerProvider();

        var client = _factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                services.AddSingleton<ILoggerProvider>(testSink);
            });
        }).CreateClient();

        const string correlationId = "trace-req-structured-log-999";
        client.DefaultRequestHeaders.Add(CorrelationIdMiddleware.HeaderName, correlationId);

        var response = await client.GetAsync("/api/test/echo-correlation-id");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        // Find log entries emitted during request execution
        var matchingRecord = testSink.Records.FirstOrDefault(r =>
            r.Scopes.Any(s => s is IReadOnlyCollection<KeyValuePair<string, object>> dict &&
                              dict.Any(kv => kv.Key == "CorrelationId" && kv.Value?.ToString() == correlationId)));

        Assert.NotNull(matchingRecord);
    }

    [Fact]
    public async Task CorrelationId_ExceptionPath_PreservesSameCorrelationId()
    {
        var client = _factory.CreateClient();
        const string incomingCorrelationId = "trace-req-error-exception-777";
        client.DefaultRequestHeaders.Add(CorrelationIdMiddleware.HeaderName, incomingCorrelationId);

        var response = await client.GetAsync("/api/test/throw-error");

        Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        Assert.True(response.Headers.Contains(CorrelationIdMiddleware.HeaderName));

        var responseCorrelationId = response.Headers.GetValues(CorrelationIdMiddleware.HeaderName).Single();
        Assert.Equal(incomingCorrelationId, responseCorrelationId);

        var problem = await response.Content.ReadFromJsonAsync<ProblemDetails>();
        Assert.NotNull(problem);
        Assert.True(problem.Extensions.ContainsKey("correlationId"));

        var problemCorrelationId = ((JsonElement)problem.Extensions["correlationId"]!).GetString();
        Assert.Equal(incomingCorrelationId, problemCorrelationId);
    }

    [Fact]
    public async Task CorrelationId_HealthEndpoints_IncludeHeaderWithoutEmittingHealthyLogs()
    {
        var client = _factory.CreateClient();
        const string healthCorrelationId = "trace-req-health-probe-555";
        client.DefaultRequestHeaders.Add(CorrelationIdMiddleware.HeaderName, healthCorrelationId);

        var healthzResponse = await client.GetAsync("/healthz");
        Assert.Equal(HttpStatusCode.OK, healthzResponse.StatusCode);
        Assert.True(healthzResponse.Headers.Contains(CorrelationIdMiddleware.HeaderName));
        Assert.Equal(healthCorrelationId, healthzResponse.Headers.GetValues(CorrelationIdMiddleware.HeaderName).Single());

        var readyzResponse = await client.GetAsync("/readyz");
        Assert.Equal(HttpStatusCode.OK, readyzResponse.StatusCode);
        Assert.True(readyzResponse.Headers.Contains(CorrelationIdMiddleware.HeaderName));
        Assert.Equal(healthCorrelationId, readyzResponse.Headers.GetValues(CorrelationIdMiddleware.HeaderName).Single());
    }
}
