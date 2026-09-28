using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using RidePlanner.Api.Common;
using Xunit;

namespace RidePlanner.Api.IntegrationTests;

public class TestHostEnvironment : IHostEnvironment
{
    public string EnvironmentName { get; set; } = Environments.Production;
    public string ApplicationName { get; set; } = "RidePlanner.Api";
    public string ContentRootPath { get; set; } = AppContext.BaseDirectory;
    public IFileProvider ContentRootFileProvider { get; set; } = null!;
}

public class ProductionConfigurationValidatorTests
{
    private static IHostEnvironment CreateEnvironment(string environmentName)
    {
        return new TestHostEnvironment { EnvironmentName = environmentName };
    }

    private static IConfiguration CreateConfiguration(Dictionary<string, string?> values)
    {
        return new ConfigurationBuilder()
            .AddInMemoryCollection(values)
            .Build();
    }

    [Fact]
    public void Validate_InDevelopmentOrTesting_DoesNotThrow_EvenWithInsecureDefaults()
    {
        var devConfig = CreateConfiguration(new Dictionary<string, string?>
        {
            ["Jwt:Secret"] = ProductionConfigurationValidator.DefaultDevJwtSecret,
            ["ConnectionStrings:RidePlannerDatabase"] = "InMemory",
            ["Cors:AllowedOrigins:0"] = "http://localhost:5173",
            ["App:FrontendBaseUrl"] = "http://localhost:5173"
        });

        // Should not throw in Development
        var devEnv = CreateEnvironment(Environments.Development);
        var devEx = Record.Exception(() => ProductionConfigurationValidator.Validate(devConfig, devEnv));
        Assert.Null(devEx);

        // Should not throw in Testing
        var testEnv = CreateEnvironment("Testing");
        var testEx = Record.Exception(() => ProductionConfigurationValidator.Validate(devConfig, testEnv));
        Assert.Null(testEx);
    }

    private static Dictionary<string, string?> CreateValidProductionConfigDictionary()
    {
        return new Dictionary<string, string?>
        {
            ["Jwt:Secret"] = "a_very_secure_production_jwt_signing_key_that_is_long_enough_12345!",
            ["ConnectionStrings:RidePlannerDatabase"] = "Host=db.example.com;Database=rideplanner;Username=postgres;Password=secure_pw;SSL Mode=Require;",
            ["Cors:AllowedOrigins:0"] = "https://rideplanner.vercel.app",
            ["App:FrontendBaseUrl"] = "https://rideplanner.vercel.app",
            ["Authentication:Google:ClientId"] = "73286917441-test.apps.googleusercontent.com",
            ["Authentication:Google:ClientSecret"] = "GOCSPX-valid_test_secret_here",
            ["Email:Provider"] = "Resend",
            ["Email:ApiKey"] = "re_valid_production_api_key_12345"
        };
    }

    [Fact]
    public void Validate_InProduction_WithValidConfiguration_Succeeds()
    {
        var validConfig = CreateConfiguration(CreateValidProductionConfigDictionary());

        var prodEnv = CreateEnvironment(Environments.Production);
        var ex = Record.Exception(() => ProductionConfigurationValidator.Validate(validConfig, prodEnv));
        Assert.Null(ex);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData("too_short_key")]
    [InlineData(ProductionConfigurationValidator.DefaultDevJwtSecret)]
    public void Validate_InProduction_WithInvalidJwtSecret_Throws(string invalidSecret)
    {
        var dict = CreateValidProductionConfigDictionary();
        dict["Jwt:Secret"] = invalidSecret;
        var config = CreateConfiguration(dict);

        var prodEnv = CreateEnvironment(Environments.Production);
        var ex = Assert.Throws<InvalidOperationException>(() => ProductionConfigurationValidator.Validate(config, prodEnv));
        Assert.Contains("Jwt:Secret", ex.Message);
        // Ensure the secret value itself is never leaked in the exception message
        if (!string.IsNullOrWhiteSpace(invalidSecret))
        {
            Assert.DoesNotContain(invalidSecret, ex.Message);
        }
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData("InMemory")]
    public void Validate_InProduction_WithInvalidDatabase_Throws(string invalidDb)
    {
        var dict = CreateValidProductionConfigDictionary();
        dict["ConnectionStrings:RidePlannerDatabase"] = invalidDb;
        var config = CreateConfiguration(dict);

        var prodEnv = CreateEnvironment(Environments.Production);
        var ex = Assert.Throws<InvalidOperationException>(() => ProductionConfigurationValidator.Validate(config, prodEnv));
        Assert.Contains("ConnectionStrings:RidePlannerDatabase", ex.Message);
    }

    [Fact]
    public void Validate_InProduction_WithGoogleOAuthPlaceholders_Throws()
    {
        var dict = CreateValidProductionConfigDictionary();
        dict["Authentication:Google:ClientId"] = ProductionConfigurationValidator.DefaultDevGoogleClientId;
        dict["Authentication:Google:ClientSecret"] = ProductionConfigurationValidator.DefaultDevGoogleClientSecret;
        var config = CreateConfiguration(dict);

        var prodEnv = CreateEnvironment(Environments.Production);
        var ex = Assert.Throws<InvalidOperationException>(() => ProductionConfigurationValidator.Validate(config, prodEnv));
        Assert.Contains("Authentication:Google", ex.Message);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void Validate_InProduction_WithMissingGoogleClientId_Throws(string? missingClientId)
    {
        var dict = CreateValidProductionConfigDictionary();
        dict["Authentication:Google:ClientId"] = missingClientId;
        var config = CreateConfiguration(dict);

        var prodEnv = CreateEnvironment(Environments.Production);
        var ex = Assert.Throws<InvalidOperationException>(() => ProductionConfigurationValidator.Validate(config, prodEnv));
        Assert.Contains("Authentication:Google:ClientId is required in production", ex.Message);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void Validate_InProduction_WithMissingGoogleClientSecret_Throws(string? missingSecret)
    {
        var dict = CreateValidProductionConfigDictionary();
        dict["Authentication:Google:ClientSecret"] = missingSecret;
        var config = CreateConfiguration(dict);

        var prodEnv = CreateEnvironment(Environments.Production);
        var ex = Assert.Throws<InvalidOperationException>(() => ProductionConfigurationValidator.Validate(config, prodEnv));
        Assert.Contains("Authentication:Google:ClientSecret is required in production", ex.Message);
    }

    [Fact]
    public void Validate_InProduction_WhenCorsAllowedOriginsOnlyContainsLocalhost_Throws()
    {
        var dict = CreateValidProductionConfigDictionary();
        dict["Cors:AllowedOrigins:0"] = "http://localhost:5173";
        var config = CreateConfiguration(dict);

        var prodEnv = CreateEnvironment(Environments.Production);
        var ex = Assert.Throws<InvalidOperationException>(() => ProductionConfigurationValidator.Validate(config, prodEnv));
        Assert.Contains("Cors:AllowedOrigins", ex.Message);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData("http://localhost:5173")]
    public void Validate_InProduction_WhenFrontendBaseUrlIsMissingOrLocalhost_Throws(string invalidUrl)
    {
        var dict = CreateValidProductionConfigDictionary();
        dict["App:FrontendBaseUrl"] = invalidUrl;
        var config = CreateConfiguration(dict);

        var prodEnv = CreateEnvironment(Environments.Production);
        var ex = Assert.Throws<InvalidOperationException>(() => ProductionConfigurationValidator.Validate(config, prodEnv));
        Assert.Contains("App:FrontendBaseUrl", ex.Message);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData("Development")]
    public void Validate_InProduction_WhenEmailProviderIsMissingOrDevelopment_Throws(string? invalidProvider)
    {
        var dict = CreateValidProductionConfigDictionary();
        dict["Email:Provider"] = invalidProvider;
        var config = CreateConfiguration(dict);

        var prodEnv = CreateEnvironment(Environments.Production);
        var ex = Assert.Throws<InvalidOperationException>(() => ProductionConfigurationValidator.Validate(config, prodEnv));
        Assert.Contains("Email:Provider must be configured in production", ex.Message);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData("re_xxxxxxxxx")]
    [InlineData("development-placeholder")]
    public void Validate_InProduction_WhenResendApiKeyIsMissingOrPlaceholder_Throws(string? invalidApiKey)
    {
        var dict = CreateValidProductionConfigDictionary();
        dict["Email:Provider"] = "Resend";
        dict["Email:ApiKey"] = invalidApiKey;
        var config = CreateConfiguration(dict);

        var prodEnv = CreateEnvironment(Environments.Production);
        var ex = Assert.Throws<InvalidOperationException>(() => ProductionConfigurationValidator.Validate(config, prodEnv));
        Assert.Contains("Email:ApiKey", ex.Message);
    }

    private static Dictionary<string, string?> CreateValidProductionSmtpConfigDictionary()
    {
        return new Dictionary<string, string?>
        {
            ["Jwt:Secret"] = "a_very_secure_production_jwt_signing_key_that_is_long_enough_12345!",
            ["ConnectionStrings:RidePlannerDatabase"] = "Host=db.example.com;Database=rideplanner;Username=postgres;Password=secure_pw;SSL Mode=Require;",
            ["Cors:AllowedOrigins:0"] = "https://rideplanner.vercel.app",
            ["App:FrontendBaseUrl"] = "https://rideplanner.vercel.app",
            ["Authentication:Google:ClientId"] = "73286917441-test.apps.googleusercontent.com",
            ["Authentication:Google:ClientSecret"] = "GOCSPX-valid_test_secret_here",
            ["Email:Provider"] = "Smtp",
            ["Email:Smtp:Host"] = "smtp.gmail.com",
            ["Email:Smtp:Port"] = "587",
            ["Email:Smtp:Username"] = "rideplanner.app@gmail.com",
            ["Email:Smtp:Password"] = "app-password-secret-1234",
            ["Email:FromEmail"] = "RidePlanner <rideplanner.app@gmail.com>"
        };
    }

    [Fact]
    public void Validate_InProduction_WithValidSmtpConfiguration_Succeeds()
    {
        var validConfig = CreateConfiguration(CreateValidProductionSmtpConfigDictionary());

        var prodEnv = CreateEnvironment(Environments.Production);
        var ex = Record.Exception(() => ProductionConfigurationValidator.Validate(validConfig, prodEnv));
        Assert.Null(ex);
    }

    [Fact]
    public void Validate_InProduction_WhenSmtpConfigured_DoesNotRequireResendApiKey()
    {
        var dict = CreateValidProductionSmtpConfigDictionary();
        dict.Remove("Email:ApiKey");
        var config = CreateConfiguration(dict);

        var prodEnv = CreateEnvironment(Environments.Production);
        var ex = Record.Exception(() => ProductionConfigurationValidator.Validate(config, prodEnv));
        Assert.Null(ex);
    }

    [Fact]
    public void Validate_InProduction_WhenResendConfigured_DoesNotRequireSmtpCredentials()
    {
        var dict = CreateValidProductionConfigDictionary();
        dict["Email:Provider"] = "Resend";
        dict["Email:ApiKey"] = "re_valid_production_api_key_12345";
        dict.Remove("Email:Smtp:Host");
        dict.Remove("Email:Smtp:Port");
        dict.Remove("Email:Smtp:Username");
        dict.Remove("Email:Smtp:Password");
        var config = CreateConfiguration(dict);

        var prodEnv = CreateEnvironment(Environments.Production);
        var ex = Record.Exception(() => ProductionConfigurationValidator.Validate(config, prodEnv));
        Assert.Null(ex);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void Validate_InProduction_WhenSmtpHostIsMissing_Throws(string? invalidHost)
    {
        var dict = CreateValidProductionSmtpConfigDictionary();
        dict["Email:Smtp:Host"] = invalidHost;
        var config = CreateConfiguration(dict);

        var prodEnv = CreateEnvironment(Environments.Production);
        var ex = Assert.Throws<InvalidOperationException>(() => ProductionConfigurationValidator.Validate(config, prodEnv));
        Assert.Contains("Email:Smtp:Host is required", ex.Message);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData("0")]
    [InlineData("-1")]
    [InlineData("not_a_number")]
    [InlineData("70000")]
    public void Validate_InProduction_WhenSmtpPortIsMissingOrInvalid_Throws(string? invalidPort)
    {
        var dict = CreateValidProductionSmtpConfigDictionary();
        dict["Email:Smtp:Port"] = invalidPort;
        var config = CreateConfiguration(dict);

        var prodEnv = CreateEnvironment(Environments.Production);
        var ex = Assert.Throws<InvalidOperationException>(() => ProductionConfigurationValidator.Validate(config, prodEnv));
        Assert.Contains("Email:Smtp:Port", ex.Message);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void Validate_InProduction_WhenSmtpUsernameIsMissing_Throws(string? invalidUsername)
    {
        var dict = CreateValidProductionSmtpConfigDictionary();
        dict["Email:Smtp:Username"] = invalidUsername;
        var config = CreateConfiguration(dict);

        var prodEnv = CreateEnvironment(Environments.Production);
        var ex = Assert.Throws<InvalidOperationException>(() => ProductionConfigurationValidator.Validate(config, prodEnv));
        Assert.Contains("Email:Smtp:Username is required", ex.Message);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void Validate_InProduction_WhenSmtpPasswordIsMissing_Throws(string? invalidPassword)
    {
        var dict = CreateValidProductionSmtpConfigDictionary();
        dict["Email:Smtp:Password"] = invalidPassword;
        var config = CreateConfiguration(dict);

        var prodEnv = CreateEnvironment(Environments.Production);
        var ex = Assert.Throws<InvalidOperationException>(() => ProductionConfigurationValidator.Validate(config, prodEnv));
        Assert.Contains("Email:Smtp:Password is required", ex.Message);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void Validate_InProduction_WhenSmtpFromEmailIsMissing_Throws(string? invalidFromEmail)
    {
        var dict = CreateValidProductionSmtpConfigDictionary();
        dict["Email:FromEmail"] = invalidFromEmail;
        var config = CreateConfiguration(dict);

        var prodEnv = CreateEnvironment(Environments.Production);
        var ex = Assert.Throws<InvalidOperationException>(() => ProductionConfigurationValidator.Validate(config, prodEnv));
        Assert.Contains("Email:FromEmail is required", ex.Message);
    }

    [Theory]
    [InlineData("SendGrid")]
    [InlineData("Mailgun")]
    [InlineData("UnknownProvider")]
    public void Validate_InProduction_WithInvalidEmailProvider_Throws(string invalidProvider)
    {
        var dict = CreateValidProductionConfigDictionary();
        dict["Email:Provider"] = invalidProvider;
        var config = CreateConfiguration(dict);

        var prodEnv = CreateEnvironment(Environments.Production);
        var ex = Assert.Throws<InvalidOperationException>(() => ProductionConfigurationValidator.Validate(config, prodEnv));
        Assert.Contains($"Email:Provider '{invalidProvider}' is invalid", ex.Message);
    }
}
