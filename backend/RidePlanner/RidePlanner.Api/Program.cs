using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using RidePlanner.Api.Common;
using RidePlanner.Api.Middleware;
using RidePlanner.Application;
using RidePlanner.Infrastructure;
using RidePlanner.Infrastructure.Persistence;
using Scalar.AspNetCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter());
    });

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? ["http://localhost:5173"];

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddApplication();

builder.Services.AddOpenApi();

builder.Services.AddInfrastructure(
    builder.Configuration);

builder.Services.AddAuthenticationRateLimiting(
    builder.Configuration,
    builder.Environment);

var app = builder.Build();

ProductionConfigurationValidator.Validate(app.Configuration, app.Environment);

var runMigrations = app.Environment.IsDevelopment()
    || app.Configuration.GetValue<bool>("Database:RunMigrationsOnStartup")
    || string.Equals(Environment.GetEnvironmentVariable("RUN_MIGRATIONS_ON_STARTUP"), "true", StringComparison.OrdinalIgnoreCase);

if (runMigrations)
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<RidePlannerDbContext>();
    if (dbContext.Database.IsRelational())
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        try
        {
            logger.LogInformation("Applying database migrations...");
            await dbContext.Database.MigrateAsync();
            logger.LogInformation("Database migrations applied successfully.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while applying database migrations.");
            throw;
        }
    }
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    app.MapScalarApiReference();
}

app.UseMiddleware<ExceptionHandlingMiddleware>();

var forwardedHeadersOptions = new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto,
    ForwardLimit = null
};
forwardedHeadersOptions.KnownNetworks.Clear();
forwardedHeadersOptions.KnownProxies.Clear();
app.UseForwardedHeaders(forwardedHeadersOptions);

app.UseHttpsRedirection();

app.UseCors("Frontend");

app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

if (app.Environment.IsEnvironment("Testing"))
{
    app.MapGet("/api/test/connection-info", (HttpContext httpContext) => Results.Ok(new
    {
        RemoteIp = httpContext.Connection.RemoteIpAddress?.ToString(),
        Scheme = httpContext.Request.Scheme,
        IsHttps = httpContext.Request.IsHttps
    }));

    app.MapPost("/api/test/signin-external", async (HttpContext httpContext, TestExternalSignInRequest request) =>
    {
        var claims = new List<System.Security.Claims.Claim>
        {
            new(System.Security.Claims.ClaimTypes.NameIdentifier, request.ProviderKey),
            new(System.Security.Claims.ClaimTypes.Email, request.Email),
            new(System.Security.Claims.ClaimTypes.Name, request.Name ?? request.Email)
        };
        var identity = new System.Security.Claims.ClaimsIdentity(claims, Microsoft.AspNetCore.Identity.IdentityConstants.ExternalScheme);
        var principal = new System.Security.Claims.ClaimsPrincipal(identity);
        var properties = new Microsoft.AspNetCore.Authentication.AuthenticationProperties();
        if (!string.IsNullOrWhiteSpace(request.ReturnUrl))
        {
            properties.Items["returnUrl"] = request.ReturnUrl;
        }

        await httpContext.SignInAsync(Microsoft.AspNetCore.Identity.IdentityConstants.ExternalScheme, principal, properties);
        return Results.Ok();
    });
}

app.Run();

public partial class Program { }

public record TestExternalSignInRequest(string ProviderKey, string Email, string? Name = null, string? ReturnUrl = null);