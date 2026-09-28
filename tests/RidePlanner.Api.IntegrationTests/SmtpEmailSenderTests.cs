using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using RidePlanner.Application.Abstractions.Notifications;
using RidePlanner.Infrastructure;
using RidePlanner.Infrastructure.Notifications;
using Xunit;

namespace RidePlanner.Api.IntegrationTests;

public class SmtpEmailSenderTests
{
    private sealed class MockSmtpClient : ISmtpClient
    {
        public MailMessage? SentMessage { get; private set; }
        public bool Disposed { get; private set; }

        public Task SendMailAsync(MailMessage message, CancellationToken cancellationToken = default)
        {
            // Clone or copy key attributes before message is disposed
            SentMessage = new MailMessage
            {
                From = message.From != null ? new MailAddress(message.From.Address, message.From.DisplayName) : null,
                Subject = message.Subject,
                Body = message.Body,
                IsBodyHtml = message.IsBodyHtml,
            };
            foreach (var to in message.To)
            {
                SentMessage.To.Add(to);
            }

            return Task.CompletedTask;
        }

        public void Dispose()
        {
            Disposed = true;
        }
    }

    private sealed class MockSmtpClientFactory : ISmtpClientFactory
    {
        public SmtpSettings? CapturedSettings { get; private set; }
        public MockSmtpClient Client { get; } = new();

        public ISmtpClient CreateClient(SmtpSettings settings)
        {
            CapturedSettings = settings;
            return Client;
        }
    }

    [Fact]
    public async Task SendPasswordResetEmailAsync_WhenHostMissing_ThrowsInvalidOperationException()
    {
        var settings = Options.Create(new EmailSettings
        {
            Provider = "Smtp",
            Smtp = new SmtpSettings { Host = "" }
        });

        var sender = new SmtpEmailSender(settings, NullLogger<SmtpEmailSender>.Instance);

        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            sender.SendPasswordResetEmailAsync("rider@example.com", "https://rideplanner.vercel.app/reset-password?token=123"));
    }

    [Fact]
    public async Task SendPasswordResetEmailAsync_WhenSenderAddressMissing_ThrowsInvalidOperationException()
    {
        var settings = Options.Create(new EmailSettings
        {
            Provider = "Smtp",
            FromEmail = "",
            Smtp = new SmtpSettings
            {
                Host = "smtp.gmail.com",
                Username = ""
            }
        });

        var mockFactory = new MockSmtpClientFactory();
        var sender = new SmtpEmailSender(settings, NullLogger<SmtpEmailSender>.Instance, mockFactory);

        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            sender.SendPasswordResetEmailAsync("rider@example.com", "https://rideplanner.vercel.app/reset-password?token=123"));
    }

    [Fact]
    public async Task SendPasswordResetEmailAsync_WhenConfigured_ConstructsValidMailMessage_AndSendsViaTransport()
    {
        var settings = Options.Create(new EmailSettings
        {
            Provider = "Smtp",
            FromEmail = "RidePlanner <rideplanner.app@gmail.com>",
            Smtp = new SmtpSettings
            {
                Host = "smtp.gmail.com",
                Port = 587,
                Username = "rideplanner.app@gmail.com",
                Password = "app-password-secret-1234",
                EnableSsl = true
            }
        });

        var mockFactory = new MockSmtpClientFactory();
        var sender = new SmtpEmailSender(settings, NullLogger<SmtpEmailSender>.Instance, mockFactory);
        var resetUrl = "https://rideplanner.vercel.app/reset-password?token=abc-xyz";

        await sender.SendPasswordResetEmailAsync("rider@example.com", resetUrl);

        Assert.NotNull(mockFactory.CapturedSettings);
        Assert.Equal("smtp.gmail.com", mockFactory.CapturedSettings.Host);
        Assert.Equal(587, mockFactory.CapturedSettings.Port);
        Assert.Equal("rideplanner.app@gmail.com", mockFactory.CapturedSettings.Username);
        Assert.Equal("app-password-secret-1234", mockFactory.CapturedSettings.Password);
        Assert.True(mockFactory.CapturedSettings.EnableSsl);

        var message = mockFactory.Client.SentMessage;
        Assert.NotNull(message);
        Assert.Equal("rideplanner.app@gmail.com", message.From?.Address);
        Assert.Equal("RidePlanner", message.From?.DisplayName);
        Assert.Single(message.To);
        Assert.Equal("rider@example.com", message.To[0].Address);
        Assert.Equal("Reset your RidePlanner password", message.Subject);
        Assert.True(message.IsBodyHtml);
        Assert.Contains(resetUrl, message.Body);
        Assert.Contains("Password Reset Request", message.Body);
        Assert.Contains("2 hours", message.Body);
        Assert.True(mockFactory.Client.Disposed);
    }

    [Fact]
    public async Task SendPasswordResetEmailAsync_WhenFromEmailOmitted_FallsBackToSmtpUsername()
    {
        var settings = Options.Create(new EmailSettings
        {
            Provider = "Smtp",
            FromEmail = "",
            Smtp = new SmtpSettings
            {
                Host = "smtp.gmail.com",
                Port = 587,
                Username = "fallback.sender@gmail.com",
                Password = "secret-password",
                EnableSsl = true
            }
        });

        var mockFactory = new MockSmtpClientFactory();
        var sender = new SmtpEmailSender(settings, NullLogger<SmtpEmailSender>.Instance, mockFactory);

        await sender.SendPasswordResetEmailAsync("rider@example.com", "https://rideplanner.vercel.app/reset-password?token=123");

        var message = mockFactory.Client.SentMessage;
        Assert.NotNull(message);
        Assert.Equal("fallback.sender@gmail.com", message.From?.Address);
        Assert.Equal("RidePlanner", message.From?.DisplayName);
    }

    [Fact]
    public void AddInfrastructure_WhenProviderIsSmtp_RegistersSmtpEmailSender()
    {
        var services = new ServiceCollection();
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:RidePlannerDatabase"] = "InMemory",
                ["Jwt:Secret"] = "super_secret_rideplanner_jwt_signing_key_at_least_32_bytes_long!",
                ["Email:Provider"] = "Smtp",
                ["Email:Smtp:Host"] = "smtp.gmail.com",
                ["Email:Smtp:Port"] = "587",
                ["Email:Smtp:Username"] = "user@gmail.com",
                ["Email:Smtp:Password"] = "secret"
            })
            .Build();

        services.AddInfrastructure(configuration);
        using var provider = services.BuildServiceProvider();

        var emailSender = provider.GetRequiredService<IEmailSender>();
        Assert.IsType<SmtpEmailSender>(emailSender);
    }

    [Fact]
    public void AddInfrastructure_WhenProviderIsResend_RegistersResendEmailSender()
    {
        var services = new ServiceCollection();
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:RidePlannerDatabase"] = "InMemory",
                ["Jwt:Secret"] = "super_secret_rideplanner_jwt_signing_key_at_least_32_bytes_long!",
                ["Email:Provider"] = "Resend",
                ["Email:ApiKey"] = "re_test_key"
            })
            .Build();

        services.AddInfrastructure(configuration);
        using var provider = services.BuildServiceProvider();

        var emailSender = provider.GetRequiredService<IEmailSender>();
        Assert.IsType<ResendEmailSender>(emailSender);
    }

    [Fact]
    public void AddInfrastructure_WhenProviderIsDevelopment_RegistersDevelopmentEmailSender()
    {
        var services = new ServiceCollection();
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:RidePlannerDatabase"] = "InMemory",
                ["Jwt:Secret"] = "super_secret_rideplanner_jwt_signing_key_at_least_32_bytes_long!",
                ["Email:Provider"] = "Development"
            })
            .Build();

        services.AddLogging();
        services.AddSingleton<Microsoft.Extensions.Hosting.IHostEnvironment>(new TestHostEnvironment
        {
            EnvironmentName = Microsoft.Extensions.Hosting.Environments.Development
        });

        services.AddInfrastructure(configuration);
        using var provider = services.BuildServiceProvider();

        var emailSender = provider.GetRequiredService<IEmailSender>();
        Assert.IsType<DevelopmentEmailSender>(emailSender);
    }

    [Fact]
    public void AddInfrastructure_WhenProviderIsInvalid_ThrowsInvalidOperationException()
    {
        var services = new ServiceCollection();
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:RidePlannerDatabase"] = "InMemory",
                ["Jwt:Secret"] = "super_secret_rideplanner_jwt_signing_key_at_least_32_bytes_long!",
                ["Email:Provider"] = "UnknownMailService"
            })
            .Build();

        var ex = Assert.Throws<InvalidOperationException>(() => services.AddInfrastructure(configuration));
        Assert.Contains("Invalid email provider 'UnknownMailService'", ex.Message);
    }
}
