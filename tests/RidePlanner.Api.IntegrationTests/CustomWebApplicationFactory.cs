using System.Collections.Concurrent;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using RidePlanner.Application.Abstractions.Notifications;

namespace RidePlanner.Api.IntegrationTests;

public record SentResetEmail(string ToEmail, string ResetUrl);

public class TestEmailSender : IEmailSender
{
    private readonly ConcurrentBag<SentResetEmail> _sentEmails = new();

    public IReadOnlyCollection<SentResetEmail> SentEmails => _sentEmails;

    public void Clear() => _sentEmails.Clear();

    public Task SendPasswordResetEmailAsync(
        string toEmail,
        string resetUrl,
        CancellationToken cancellationToken = default)
    {
        _sentEmails.Add(new SentResetEmail(toEmail, resetUrl));
        return Task.CompletedTask;
    }
}

public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    public TestEmailSender EmailSender { get; } = new();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.ConfigureServices(services =>
        {
            services.RemoveAll<IEmailSender>();
            services.AddSingleton<IEmailSender>(EmailSender);
        });
    }
}
