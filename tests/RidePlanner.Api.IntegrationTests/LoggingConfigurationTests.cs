using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Console;
using Microsoft.Extensions.Options;
using RidePlanner.Api.Common;
using Xunit;

namespace RidePlanner.Api.IntegrationTests;

public class LoggingConfigurationTests
{
    private static (ConsoleLoggerOptions console, JsonConsoleFormatterOptions json, SimpleConsoleFormatterOptions simple, int providerCount, Type providerType) BuildLoggingOptions(
        string environmentName,
        Dictionary<string, string?>? configValues = null)
    {
        var services = new ServiceCollection();
        var environment = new TestHostEnvironment { EnvironmentName = environmentName };
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(configValues ?? [])
            .Build();

        services.AddLogging(logging =>
        {
            logging.AddRidePlannerLogging(environment, configuration);
        });

        var providerDescriptors = services.Where(d => d.ServiceType == typeof(ILoggerProvider)).ToList();
        var sp = services.BuildServiceProvider();
        var consoleOptions = sp.GetRequiredService<IOptions<ConsoleLoggerOptions>>().Value;
        var jsonOptions = sp.GetRequiredService<IOptions<JsonConsoleFormatterOptions>>().Value;
        var simpleOptions = sp.GetRequiredService<IOptions<SimpleConsoleFormatterOptions>>().Value;

        return (consoleOptions, jsonOptions, simpleOptions, providerDescriptors.Count, providerDescriptors[0].ImplementationType!);
    }

    [Fact]
    public void LoggingConfiguration_InProduction_ConfiguresExactlyOneConsoleProviderWithJsonFormatter()
    {
        var (console, json, _, providerCount, providerType) = BuildLoggingOptions(Environments.Production);

        Assert.Equal(1, providerCount);
        Assert.Equal(typeof(ConsoleLoggerProvider), providerType);
        Assert.Equal(ConsoleFormatterNames.Json, console.FormatterName);
        Assert.True(json.UseUtcTimestamp);
        Assert.True(json.IncludeScopes);
        Assert.Equal("yyyy-MM-ddTHH:mm:ss.fffZ", json.TimestampFormat);
    }

    [Fact]
    public void LoggingConfiguration_InDevelopment_ConfiguresExactlyOneConsoleProviderWithSimpleFormatter()
    {
        var (console, _, simple, providerCount, providerType) = BuildLoggingOptions(Environments.Development);

        Assert.Equal(1, providerCount);
        Assert.Equal(typeof(ConsoleLoggerProvider), providerType);
        Assert.Equal(ConsoleFormatterNames.Simple, console.FormatterName);
        Assert.True(simple.SingleLine);
        Assert.Equal("HH:mm:ss ", simple.TimestampFormat);
    }

    [Fact]
    public void LoggingConfiguration_ExplicitFormatterConfig_OverridesEnvironmentDefault()
    {
        // 1. Development overridden to json
        var (devConsole, devJson, _, devCount, devType) = BuildLoggingOptions(Environments.Development, new Dictionary<string, string?>
        {
            ["Logging:Console:FormatterName"] = "json"
        });
        Assert.Equal(1, devCount);
        Assert.Equal(typeof(ConsoleLoggerProvider), devType);
        Assert.Equal(ConsoleFormatterNames.Json, devConsole.FormatterName);
        Assert.True(devJson.UseUtcTimestamp);

        // 2. Production overridden to simple
        var (prodConsole, _, prodSimple, prodCount, prodType) = BuildLoggingOptions(Environments.Production, new Dictionary<string, string?>
        {
            ["Logging:Console:FormatterName"] = "simple"
        });
        Assert.Equal(1, prodCount);
        Assert.Equal(typeof(ConsoleLoggerProvider), prodType);
        Assert.Equal(ConsoleFormatterNames.Simple, prodConsole.FormatterName);
        Assert.True(prodSimple.SingleLine);
    }

    [Fact]
    public void LoggingConfiguration_AppSettings_DefaultsAreCorrectlyDeclared()
    {
        var basePath = AppContext.BaseDirectory;
        var projectRoot = Path.GetFullPath(Path.Combine(basePath, "..", "..", "..", "..", "..", "backend", "RidePlanner", "RidePlanner.Api"));

        var baseConfig = new ConfigurationBuilder()
            .SetBasePath(projectRoot)
            .AddJsonFile("appsettings.json", optional: false)
            .Build();

        Assert.Equal("json", baseConfig["Logging:Console:FormatterName"]);

        var devConfig = new ConfigurationBuilder()
            .SetBasePath(projectRoot)
            .AddJsonFile("appsettings.json", optional: false)
            .AddJsonFile("appsettings.Development.json", optional: false)
            .Build();

        Assert.Equal("simple", devConfig["Logging:Console:FormatterName"]);
    }

    [Fact]
    public void Logging_ProducesSingleRecordInExpectedFormat_ForBothEnvironments()
    {
        // Verify Development simple single record
        var devOutput = CaptureConsoleOutput(Environments.Development, "TestDevMessage");
        Assert.Single(devOutput);
        Assert.Contains("TestDevMessage", devOutput[0]);
        Assert.DoesNotContain("{", devOutput[0]); // not JSON

        // Verify Production JSON single record
        var prodOutput = CaptureConsoleOutput(Environments.Production, "TestProdMessage");
        Assert.Single(prodOutput);
        Assert.Contains("TestProdMessage", prodOutput[0]);
        using var doc = JsonDocument.Parse(prodOutput[0]);
        Assert.Equal("Information", doc.RootElement.GetProperty("LogLevel").GetString());
        Assert.Equal("TestProdMessage", doc.RootElement.GetProperty("Message").GetString());
    }

    private static List<string> CaptureConsoleOutput(string environmentName, string message)
    {
        var originalOut = Console.Out;
        using var stringWriter = new StringWriter();
        try
        {
            Console.SetOut(stringWriter);

            var services = new ServiceCollection();
            var environment = new TestHostEnvironment { EnvironmentName = environmentName };
            var configuration = new ConfigurationBuilder().Build();

            services.AddLogging(logging =>
            {
                logging.AddRidePlannerLogging(environment, configuration);
            });

            using (var sp = services.BuildServiceProvider())
            {
                var logger = sp.GetRequiredService<ILogger<LoggingConfigurationTests>>();
                logger.LogInformation("{Message}", message);
            }

            var text = stringWriter.ToString().Trim();
            if (string.IsNullOrEmpty(text))
            {
                return [];
            }

            return text.Split([Environment.NewLine, "\n", "\r"], StringSplitOptions.RemoveEmptyEntries).ToList();
        }
        finally
        {
            Console.SetOut(originalOut);
        }
    }
}
