using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using RidePlanner.Application.Abstractions.Notifications;

namespace RidePlanner.Infrastructure.Notifications;

public class DevelopmentEmailSender : IEmailSender
{
    private readonly ILogger<DevelopmentEmailSender> _logger;
    private readonly IHostEnvironment _environment;

    public DevelopmentEmailSender(
        ILogger<DevelopmentEmailSender> logger,
        IHostEnvironment environment)
    {
        _logger = logger;
        _environment = environment;
    }

    public Task SendPasswordResetEmailAsync(
        string toEmail,
        string resetUrl,
        CancellationToken cancellationToken = default)
    {
        if (_environment.IsProduction())
        {
            _logger.LogWarning(
                """
                ================================================================================
                [PRODUCTION DEMO SENDER] Transactional email provider is not configured.
                Password reset link generated for {ToEmail} was routed to application logs:
                {ResetUrl}
                ================================================================================
                """,
                toEmail,
                resetUrl);
        }
        else
        {
            _logger.LogInformation(
                """
                ================================================================================
                [DEVELOPMENT EMAIL SENDER] Password Reset Link
                To: {ToEmail}
                Reset URL: {ResetUrl}
                ================================================================================
                """,
                toEmail,
                resetUrl);
        }

        return Task.CompletedTask;
    }
}
