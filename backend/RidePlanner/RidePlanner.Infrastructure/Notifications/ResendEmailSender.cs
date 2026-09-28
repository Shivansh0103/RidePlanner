using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RidePlanner.Application.Abstractions.Notifications;

namespace RidePlanner.Infrastructure.Notifications;

public class ResendEmailSender : IEmailSender
{
    private readonly HttpClient _httpClient;
    private readonly EmailSettings _settings;
    private readonly ILogger<ResendEmailSender> _logger;

    public ResendEmailSender(
        HttpClient httpClient,
        IOptions<EmailSettings> settings,
        ILogger<ResendEmailSender> logger)
    {
        _httpClient = httpClient;
        _settings = settings.Value;
        _logger = logger;
    }

    public async Task SendPasswordResetEmailAsync(
        string toEmail,
        string resetUrl,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_settings.ApiKey))
        {
            _logger.LogError("Resend API key is missing or not configured. Cannot send password reset email to {ToEmail}.", toEmail);
            throw new InvalidOperationException("Resend API key is not configured.");
        }

        var htmlBody = EmailTemplateGenerator.GeneratePasswordResetHtml(resetUrl);

        var payload = new ResendEmailRequest
        {
            From = string.IsNullOrWhiteSpace(_settings.FromEmail) ? "RidePlanner <onboarding@resend.dev>" : _settings.FromEmail,
            To = [toEmail],
            Subject = "Reset your RidePlanner password",
            Html = htmlBody,
        };

        using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.resend.com/emails");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _settings.ApiKey.Trim());
        request.Content = JsonContent.Create(payload);

        _logger.LogInformation("Dispatching password reset email to {ToEmail} via Resend API.", toEmail);

        var response = await _httpClient.SendAsync(request, cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync(cancellationToken);
            _logger.LogError("Resend API request failed with status {StatusCode}: {ErrorBody}", response.StatusCode, errorBody);
            throw new HttpRequestException($"Resend email transmission failed: {response.StatusCode} - {errorBody}");
        }

        var resendResponse = await response.Content.ReadFromJsonAsync<ResendEmailResponse>(cancellationToken: cancellationToken);
        _logger.LogInformation("Password reset email successfully queued with Resend. MessageId: {MessageId}", resendResponse?.Id);
    }

    private sealed class ResendEmailRequest
    {
        [JsonPropertyName("from")]
        public required string From { get; init; }

        [JsonPropertyName("to")]
        public required string[] To { get; init; }

        [JsonPropertyName("subject")]
        public required string Subject { get; init; }

        [JsonPropertyName("html")]
        public required string Html { get; init; }
    }

    private sealed class ResendEmailResponse
    {
        [JsonPropertyName("id")]
        public string? Id { get; init; }
    }
}
