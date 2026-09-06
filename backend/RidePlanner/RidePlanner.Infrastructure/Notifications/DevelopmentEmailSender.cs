using Microsoft.Extensions.Logging;
using RidePlanner.Application.Abstractions.Notifications;

namespace RidePlanner.Infrastructure.Notifications;

public class DevelopmentEmailSender : IEmailSender
{
    private readonly ILogger<DevelopmentEmailSender> _logger;

    public DevelopmentEmailSender(ILogger<DevelopmentEmailSender> logger)
    {
        _logger = logger;
    }

    public Task SendPasswordResetEmailAsync(
        string toEmail,
        string resetUrl,
        CancellationToken cancellationToken = default)
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

        return Task.CompletedTask;
    }
}
