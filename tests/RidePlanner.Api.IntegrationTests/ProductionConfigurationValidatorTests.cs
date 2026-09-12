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

    [Fact]
    public void Validate_InProduction_WithValidConfiguration_Succeeds()
    {
        var validConfig = CreateConfiguration(new Dictionary<string, string?>
        {
            ["Jwt:Secret"] = "a_very_secure_production_jwt_signing_key_that_is_long_enough_12345!",
            ["ConnectionStrings:RidePlannerDatabase"] = "Host=db.example.com;Database=rideplanner;Username=postgres;Password=secure_pw;SSL Mode=Require;",
            ["Cors:AllowedOrigins:0"] = "https://rideplanner.vercel.app",
            ["App:FrontendBaseUrl"] = "https://rideplanner.vercel.app"
        });

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
        var config = CreateConfiguration(new Dictionary<string, string?>
        {
            ["Jwt:Secret"] = invalidSecret,
            ["ConnectionStrings:RidePlannerDatabase"] = "Host=db.example.com;Database=rideplanner;Username=postgres;Password=secure_pw;",
            ["Cors:AllowedOrigins:0"] = "https://rideplanner.vercel.app",
            ["App:FrontendBaseUrl"] = "https://rideplanner.vercel.app"
        });

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
        var config = CreateConfiguration(new Dictionary<string, string?>
        {
            ["Jwt:Secret"] = "a_very_secure_production_jwt_signing_key_that_is_long_enough_12345!",
            ["ConnectionStrings:RidePlannerDatabase"] = invalidDb,
            ["Cors:AllowedOrigins:0"] = "https://rideplanner.vercel.app",
            ["App:FrontendBaseUrl"] = "https://rideplanner.vercel.app"
        });

        var prodEnv = CreateEnvironment(Environments.Production);
        var ex = Assert.Throws<InvalidOperationException>(() => ProductionConfigurationValidator.Validate(config, prodEnv));
        Assert.Contains("ConnectionStrings:RidePlannerDatabase", ex.Message);
    }

    [Fact]
    public void Validate_InProduction_WithGoogleOAuthPlaceholders_Throws()
    {
        var config = CreateConfiguration(new Dictionary<string, string?>
        {
            ["Jwt:Secret"] = "a_very_secure_production_jwt_signing_key_that_is_long_enough_12345!",
            ["ConnectionStrings:RidePlannerDatabase"] = "Host=db.example.com;Database=rideplanner;Username=postgres;Password=secure_pw;",
            ["Cors:AllowedOrigins:0"] = "https://rideplanner.vercel.app",
            ["App:FrontendBaseUrl"] = "https://rideplanner.vercel.app",
            ["Authentication:Google:ClientId"] = ProductionConfigurationValidator.DefaultDevGoogleClientId,
            ["Authentication:Google:ClientSecret"] = ProductionConfigurationValidator.DefaultDevGoogleClientSecret
        });

        var prodEnv = CreateEnvironment(Environments.Production);
        var ex = Assert.Throws<InvalidOperationException>(() => ProductionConfigurationValidator.Validate(config, prodEnv));
        Assert.Contains("Authentication:Google", ex.Message);
    }

    [Fact]
    public void Validate_InProduction_WhenCorsAllowedOriginsOnlyContainsLocalhost_Throws()
    {
        var config = CreateConfiguration(new Dictionary<string, string?>
        {
            ["Jwt:Secret"] = "a_very_secure_production_jwt_signing_key_that_is_long_enough_12345!",
            ["ConnectionStrings:RidePlannerDatabase"] = "Host=db.example.com;Database=rideplanner;Username=postgres;Password=secure_pw;",
            ["Cors:AllowedOrigins:0"] = "http://localhost:5173",
            ["App:FrontendBaseUrl"] = "https://rideplanner.vercel.app"
        });

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
        var config = CreateConfiguration(new Dictionary<string, string?>
        {
            ["Jwt:Secret"] = "a_very_secure_production_jwt_signing_key_that_is_long_enough_12345!",
            ["ConnectionStrings:RidePlannerDatabase"] = "Host=db.example.com;Database=rideplanner;Username=postgres;Password=secure_pw;",
            ["Cors:AllowedOrigins:0"] = "https://rideplanner.vercel.app",
            ["App:FrontendBaseUrl"] = invalidUrl
        });

        var prodEnv = CreateEnvironment(Environments.Production);
        var ex = Assert.Throws<InvalidOperationException>(() => ProductionConfigurationValidator.Validate(config, prodEnv));
        Assert.Contains("App:FrontendBaseUrl", ex.Message);
    }
}
