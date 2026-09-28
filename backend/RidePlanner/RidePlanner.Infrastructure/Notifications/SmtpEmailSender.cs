using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RidePlanner.Application.Abstractions.Notifications;

namespace RidePlanner.Infrastructure.Notifications;

public interface ISmtpClient : IDisposable
{
    Task SendMailAsync(MailMessage message, CancellationToken cancellationToken = default);
}

public interface ISmtpClientFactory
{
    ISmtpClient CreateClient(SmtpSettings settings);
}

public class DefaultSmtpClientFactory : ISmtpClientFactory
{
    public ISmtpClient CreateClient(SmtpSettings settings)
    {
        return new DefaultSmtpClient(settings);
    }

    private sealed class DefaultSmtpClient : ISmtpClient
    {
        private readonly SmtpClient _client;

        public DefaultSmtpClient(SmtpSettings settings)
        {
            _client = new SmtpClient(settings.Host, settings.Port)
            {
                EnableSsl = settings.EnableSsl,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
            };

            if (!string.IsNullOrWhiteSpace(settings.Username))
            {
                _client.Credentials = new NetworkCredential(settings.Username, settings.Password);
            }
        }

        public Task SendMailAsync(MailMessage message, CancellationToken cancellationToken = default)
        {
            return _client.SendMailAsync(message, cancellationToken);
        }

        public void Dispose()
        {
            _client.Dispose();
        }
    }
}

public class SmtpEmailSender : IEmailSender
{
    private readonly EmailSettings _settings;
    private readonly ISmtpClientFactory _smtpClientFactory;
    private readonly ILogger<SmtpEmailSender> _logger;

    public SmtpEmailSender(
        IOptions<EmailSettings> settings,
        ILogger<SmtpEmailSender> logger,
        ISmtpClientFactory? smtpClientFactory = null)
    {
        _settings = settings.Value;
        _logger = logger;
        _smtpClientFactory = smtpClientFactory ?? new DefaultSmtpClientFactory();
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

        var fromAddress = !string.IsNullOrWhiteSpace(_settings.FromEmail)
            ? _settings.FromEmail
            : (!string.IsNullOrWhiteSpace(_settings.Smtp.Username)
                ? $"RidePlanner <{_settings.Smtp.Username}>"
                : throw new InvalidOperationException("Sender email address (FromEmail or SMTP Username) is not configured."));

        var htmlBody = EmailTemplateGenerator.GeneratePasswordResetHtml(resetUrl);

        using var client = _smtpClientFactory.CreateClient(_settings.Smtp);

        using var mailMessage = new MailMessage
        {
            From = new MailAddress(fromAddress),
            Subject = "Reset your RidePlanner password",
            Body = htmlBody,
            IsBodyHtml = true,
        };
        mailMessage.To.Add(toEmail);

        _logger.LogInformation("Dispatching password reset email to {ToEmail} via SMTP ({Host}:{Port}).", toEmail, _settings.Smtp.Host, _settings.Smtp.Port);

        await client.SendMailAsync(mailMessage, cancellationToken);

        _logger.LogInformation("Password reset email sent to {ToEmail} via SMTP.", toEmail);
    }
}
