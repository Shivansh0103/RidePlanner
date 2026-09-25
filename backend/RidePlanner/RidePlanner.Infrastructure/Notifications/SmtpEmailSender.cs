using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RidePlanner.Application.Abstractions.Notifications;

namespace RidePlanner.Infrastructure.Notifications;

public class SmtpEmailSender : IEmailSender
{
    private readonly EmailSettings _settings;
    private readonly ILogger<SmtpEmailSender> _logger;

    public SmtpEmailSender(
        IOptions<EmailSettings> settings,
        ILogger<SmtpEmailSender> logger)
    {
        _settings = settings.Value;
        _logger = logger;
    }

    public async Task SendPasswordResetEmailAsync(
        string toEmail,
        string resetUrl,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_settings.Smtp.Host))
        {
            _logger.LogError("SMTP host is not configured. Cannot send password reset email to {ToEmail}.", toEmail);
            throw new InvalidOperationException("SMTP host is not configured.");
        }

        var htmlBody = EmailTemplateGenerator.GeneratePasswordResetHtml(resetUrl);

        using var client = new SmtpClient(_settings.Smtp.Host, _settings.Smtp.Port)
        {
            EnableSsl = _settings.Smtp.EnableSsl,
        };

        if (!string.IsNullOrWhiteSpace(_settings.Smtp.Username))
        {
            client.Credentials = new NetworkCredential(_settings.Smtp.Username, _settings.Smtp.Password);
        }

        using var mailMessage = new MailMessage
        {
            From = new MailAddress(_settings.FromEmail),
            Subject = "Reset your RidePlanner password",
            Body = htmlBody,
            IsBodyHtml = true,
        };
        mailMessage.To.Add(toEmail);

        _logger.LogInformation("Dispatching password reset email to {ToEmail} via SMTP ({Host}:{Port}).", toEmail, _settings.Smtp.Host, _settings.Smtp.Port);

#if NET8_0_OR_GREATER
        await client.SendMailAsync(mailMessage, cancellationToken);
#else
        await client.SendMailAsync(mailMessage);
#endif
        _logger.LogInformation("Password reset email sent to {ToEmail} via SMTP.", toEmail);
    }
}
