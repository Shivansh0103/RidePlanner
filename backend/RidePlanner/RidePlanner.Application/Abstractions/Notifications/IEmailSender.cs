namespace RidePlanner.Application.Abstractions.Notifications;

public interface IEmailSender
{
    Task SendPasswordResetEmailAsync(
        string toEmail,
        string resetUrl,
        CancellationToken cancellationToken = default);
}
