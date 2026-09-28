namespace RidePlanner.Infrastructure.Notifications;

public class EmailSettings
{
    public const string SectionName = "Email";

    public string Provider { get; set; } = "Development";
    public string ApiKey { get; set; } = string.Empty;
    public string FromEmail { get; set; } = "RidePlanner <onboarding@resend.dev>";
    public SmtpSettings Smtp { get; set; } = new();
}

public class SmtpSettings
{
    public string Host { get; set; } = string.Empty;
    public int Port { get; set; } = 587;
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public bool EnableSsl { get; set; } = true;
}
