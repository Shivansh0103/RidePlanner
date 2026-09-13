using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Console;

namespace RidePlanner.Api.Common;

public static class LoggingExtensions
{
    public static ILoggingBuilder AddRidePlannerLogging(
        this ILoggingBuilder logging,
        IHostEnvironment environment,
        IConfiguration configuration)
    {
        logging.ClearProviders();
        logging.AddConfiguration(configuration.GetSection("Logging"));

        var formatterName = configuration["Logging:Console:FormatterName"];
        var useJson = string.Equals(formatterName, "json", StringComparison.OrdinalIgnoreCase)
            || (string.IsNullOrEmpty(formatterName) && !environment.IsDevelopment());

        if (useJson)
        {
            logging.AddJsonConsole(options =>
            {
                options.IncludeScopes = true;
                options.TimestampFormat = "yyyy-MM-ddTHH:mm:ss.fffZ";
                options.UseUtcTimestamp = true;
            });
        }
        else
        {
            logging.AddSimpleConsole(options =>
            {
                options.SingleLine = true;
                options.TimestampFormat = "HH:mm:ss ";
            });
        }

        return logging;
    }
}
