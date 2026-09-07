using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Options;

namespace RidePlanner.Api.Common;

public static class RateLimitingExtensions
{
    public static IServiceCollection AddAuthenticationRateLimiting(
        this IServiceCollection services,
        IConfiguration configuration,
        IHostEnvironment environment)
    {
        services.Configure<RateLimitingSettings>(configuration.GetSection(RateLimitingSettings.SectionName));

        services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

            options.OnRejected = async (context, cancellationToken) =>
            {
                context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                context.HttpContext.Response.ContentType = "application/problem+json";

                string retryAfterSeconds = "60";
                if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
                {
                    var seconds = Math.Max(1, (int)Math.Ceiling(retryAfter.TotalSeconds));
                    retryAfterSeconds = seconds.ToString();
                    context.HttpContext.Response.Headers.RetryAfter = retryAfterSeconds;
                }

                var endpoint = context.HttpContext.GetEndpoint();
                var policyName = endpoint?.Metadata.GetMetadata<EnableRateLimitingAttribute>()?.PolicyName
                    ?? "AuthRateLimit";

                var clientIp = ResolveClientIp(context.HttpContext, environment);

                var loggerFactory = context.HttpContext.RequestServices.GetService<ILoggerFactory>();
                var logger = loggerFactory?.CreateLogger("RidePlanner.Api.RateLimiting");
                logger?.LogWarning(
                    "Authentication rate limit exceeded: Policy={PolicyName}, Method={Method}, Path={Path}, ClientIP={ClientIp}, RetryAfter={RetryAfterSeconds}s",
                    policyName,
                    context.HttpContext.Request.Method,
                    context.HttpContext.Request.Path,
                    clientIp,
                    retryAfterSeconds);

                var problemDetails = new ProblemDetails
                {
                    Type = "https://tools.ietf.org/html/rfc6585#section-4",
                    Title = "Too Many Requests",
                    Status = StatusCodes.Status429TooManyRequests,
                    Detail = $"Too many requests. Please try again in {retryAfterSeconds} seconds.",
                    Instance = context.HttpContext.Request.Path
                };

                await context.HttpContext.Response.WriteAsJsonAsync(
                    problemDetails,
                    options: (System.Text.Json.JsonSerializerOptions?)null,
                    contentType: "application/problem+json",
                    cancellationToken: cancellationToken);
            };

            options.AddPolicy(RateLimitPolicies.Login, httpContext =>
            {
                var settings = GetCurrentSettings(httpContext);
                return RateLimitPartition.GetFixedWindowLimiter(
                    ResolveClientIp(httpContext, environment),
                    _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = settings.Login.PermitLimit,
                        Window = TimeSpan.FromSeconds(settings.Login.WindowSeconds),
                        QueueLimit = 0,
                        AutoReplenishment = true
                    });
            });

            options.AddPolicy(RateLimitPolicies.Register, httpContext =>
            {
                var settings = GetCurrentSettings(httpContext);
                return RateLimitPartition.GetFixedWindowLimiter(
                    ResolveClientIp(httpContext, environment),
                    _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = settings.Register.PermitLimit,
                        Window = TimeSpan.FromSeconds(settings.Register.WindowSeconds),
                        QueueLimit = 0,
                        AutoReplenishment = true
                    });
            });

            options.AddPolicy(RateLimitPolicies.ForgotPassword, httpContext =>
            {
                var settings = GetCurrentSettings(httpContext);
                return RateLimitPartition.GetFixedWindowLimiter(
                    ResolveClientIp(httpContext, environment),
                    _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = settings.ForgotPassword.PermitLimit,
                        Window = TimeSpan.FromSeconds(settings.ForgotPassword.WindowSeconds),
                        QueueLimit = 0,
                        AutoReplenishment = true
                    });
            });

            options.AddPolicy(RateLimitPolicies.ResetPassword, httpContext =>
            {
                var settings = GetCurrentSettings(httpContext);
                return RateLimitPartition.GetFixedWindowLimiter(
                    ResolveClientIp(httpContext, environment),
                    _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = settings.ResetPassword.PermitLimit,
                        Window = TimeSpan.FromSeconds(settings.ResetPassword.WindowSeconds),
                        QueueLimit = 0,
                        AutoReplenishment = true
                    });
            });

            options.AddPolicy(RateLimitPolicies.ExternalLink, httpContext =>
            {
                var settings = GetCurrentSettings(httpContext);
                return RateLimitPartition.GetFixedWindowLimiter(
                    ResolveClientIp(httpContext, environment),
                    _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = settings.ExternalLink.PermitLimit,
                        Window = TimeSpan.FromSeconds(settings.ExternalLink.WindowSeconds),
                        QueueLimit = 0,
                        AutoReplenishment = true
                    });
            });
        });

        return services;
    }

    public static string ResolveClientIp(HttpContext context, IHostEnvironment environment)
    {
        if (environment.IsEnvironment("Testing") &&
            context.Request.Headers.TryGetValue("X-Test-Client-IP", out var testIp) &&
            !string.IsNullOrWhiteSpace(testIp))
        {
            return testIp.ToString();
        }

        return context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
    }

    private static RateLimitingSettings GetCurrentSettings(HttpContext httpContext)
    {
        return httpContext.RequestServices.GetService<IOptions<RateLimitingSettings>>()?.Value
            ?? new RateLimitingSettings();
    }
}
