using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using RidePlanner.Infrastructure.Persistence;

namespace RidePlanner.Api.Common;

public static class HealthCheckExtensions
{
    public static IServiceCollection AddRidePlannerHealthChecks(this IServiceCollection services)
    {
        services.AddHealthChecks()
            .AddCheck("self", () => HealthCheckResult.Healthy(), tags: ["live"])
            .AddDbContextCheck<RidePlannerDbContext>(
                name: "database",
                failureStatus: HealthStatus.Unhealthy,
                tags: ["ready"],
                customTestQuery: async (dbContext, cancellationToken) =>
                {
                    using var cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
                    cts.CancelAfter(TimeSpan.FromSeconds(5));
                    return await dbContext.Database.CanConnectAsync(cts.Token);
                });

        return services;
    }

    public static IEndpointRouteBuilder MapRidePlannerHealthChecks(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapHealthChecks("/healthz", new HealthCheckOptions
        {
            Predicate = check => check.Tags.Contains("live"),
            ResponseWriter = WriteHealthCheckResponse
        })
        .AllowAnonymous()
        .DisableRateLimiting();

        endpoints.MapHealthChecks("/readyz", new HealthCheckOptions
        {
            Predicate = check => check.Tags.Contains("ready"),
            ResultStatusCodes =
            {
                [HealthStatus.Healthy] = StatusCodes.Status200OK,
                [HealthStatus.Degraded] = StatusCodes.Status200OK,
                [HealthStatus.Unhealthy] = StatusCodes.Status503ServiceUnavailable
            },
            ResponseWriter = WriteHealthCheckResponse
        })
        .AllowAnonymous()
        .DisableRateLimiting();

        return endpoints;
    }

    private static Task WriteHealthCheckResponse(HttpContext context, HealthReport report)
    {
        if (report.Status != HealthStatus.Healthy)
        {
            var loggerFactory = context.RequestServices.GetService<ILoggerFactory>();
            var logger = loggerFactory?.CreateLogger("RidePlanner.Api.HealthChecks");
            logger?.LogWarning(
                "Health check probe failed: Path={Path}, Status={Status}, TotalDuration={Duration}ms",
                context.Request.Path,
                report.Status,
                report.TotalDuration.TotalMilliseconds);
        }

        context.Response.ContentType = "application/json";

        var payload = new
        {
            status = report.Status.ToString(),
            checks = report.Entries.Select(e => new
            {
                name = e.Key,
                status = e.Value.Status.ToString()
            })
        };

        return context.Response.WriteAsJsonAsync(payload);
    }
}
