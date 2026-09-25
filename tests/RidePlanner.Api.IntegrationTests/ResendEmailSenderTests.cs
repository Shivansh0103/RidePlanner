using System.Net;
using System.Text.Json;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using RidePlanner.Infrastructure.Notifications;
using Xunit;

namespace RidePlanner.Api.IntegrationTests;

public class ResendEmailSenderTests
{
    private class MockHttpMessageHandler : HttpMessageHandler
    {
        public HttpRequestMessage? CapturedRequest { get; private set; }
        public string? CapturedContent { get; private set; }
        public HttpStatusCode StatusCodeToReturn { get; set; } = HttpStatusCode.OK;
        public string ResponseContentToReturn { get; set; } = """{"id": "msg_test_12345"}""";

        protected override async Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request,
            CancellationToken cancellationToken)
        {
            CapturedRequest = request;
            if (request.Content != null)
            {
                CapturedContent = await request.Content.ReadAsStringAsync(cancellationToken);
            }

            return new HttpResponseMessage(StatusCodeToReturn)
            {
                Content = new StringContent(ResponseContentToReturn, System.Text.Encoding.UTF8, "application/json")
            };
        }
    }

    [Fact]
    public async Task SendPasswordResetEmailAsync_WhenApiKeyMissing_ThrowsInvalidOperationException()
    {
        var handler = new MockHttpMessageHandler();
        var httpClient = new HttpClient(handler);
        var settings = Options.Create(new EmailSettings
        {
            Provider = "Resend",
            ApiKey = "",
            FromEmail = "RidePlanner <onboarding@resend.dev>"
        });

        var sender = new ResendEmailSender(httpClient, settings, NullLogger<ResendEmailSender>.Instance);

        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            sender.SendPasswordResetEmailAsync("rider@example.com", "https://rideplanner.vercel.app/reset-password?token=123"));
    }

    [Fact]
    public async Task SendPasswordResetEmailAsync_WhenConfigured_SendsAuthorizedPostWithBrandedHtml()
    {
        var handler = new MockHttpMessageHandler();
        var httpClient = new HttpClient(handler);
        var settings = Options.Create(new EmailSettings
        {
            Provider = "Resend",
            ApiKey = "re_test_key_123456",
            FromEmail = "RidePlanner <onboarding@resend.dev>"
        });

        var sender = new ResendEmailSender(httpClient, settings, NullLogger<ResendEmailSender>.Instance);
        var resetUrl = "https://rideplanner.vercel.app/reset-password?token=abc-xyz";

        await sender.SendPasswordResetEmailAsync("rider@example.com", resetUrl);

        Assert.NotNull(handler.CapturedRequest);
        Assert.Equal(HttpMethod.Post, handler.CapturedRequest.Method);
        Assert.Equal("https://api.resend.com/emails", handler.CapturedRequest.RequestUri?.ToString());
        Assert.Equal("Bearer", handler.CapturedRequest.Headers.Authorization?.Scheme);
        Assert.Equal("re_test_key_123456", handler.CapturedRequest.Headers.Authorization?.Parameter);

        Assert.NotNull(handler.CapturedContent);
        using var jsonDoc = JsonDocument.Parse(handler.CapturedContent);
        var root = jsonDoc.RootElement;

        Assert.Equal("RidePlanner <onboarding@resend.dev>", root.GetProperty("from").GetString());
        Assert.Equal("rider@example.com", root.GetProperty("to")[0].GetString());
        Assert.Equal("Reset your RidePlanner password", root.GetProperty("subject").GetString());

        var html = root.GetProperty("html").GetString();
        Assert.NotNull(html);
        Assert.Contains(resetUrl, html);
        Assert.Contains("Password Reset Request", html);
        Assert.Contains("2 hours", html);
    }

    [Fact]
    public async Task SendPasswordResetEmailAsync_WhenResendApiReturnsError_ThrowsHttpRequestException()
    {
        var handler = new MockHttpMessageHandler
        {
            StatusCodeToReturn = HttpStatusCode.Unauthorized,
            ResponseContentToReturn = """{"statusCode": 401, "message": "API key is invalid"}"""
        };
        var httpClient = new HttpClient(handler);
        var settings = Options.Create(new EmailSettings
        {
            Provider = "Resend",
            ApiKey = "re_invalid_key",
            FromEmail = "RidePlanner <onboarding@resend.dev>"
        });

        var sender = new ResendEmailSender(httpClient, settings, NullLogger<ResendEmailSender>.Instance);

        var ex = await Assert.ThrowsAsync<HttpRequestException>(() =>
            sender.SendPasswordResetEmailAsync("rider@example.com", "https://rideplanner.vercel.app/reset-password?token=123"));

        Assert.Contains("401", ex.Message);
    }
}
