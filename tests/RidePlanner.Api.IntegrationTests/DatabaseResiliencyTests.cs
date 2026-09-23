using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using RidePlanner.Infrastructure;
using RidePlanner.Infrastructure.Persistence;
using Xunit;

namespace RidePlanner.Api.IntegrationTests;

public class DatabaseResiliencyTests
{
    [Fact]
    public void AddInfrastructure_WhenNpgsqlConfigured_RegistersRetryingExecutionStrategy()
    {
        var services = new ServiceCollection();
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:RidePlannerDatabase"] = "Host=localhost;Database=test;Username=postgres;Password=test;",
                ["Jwt:Secret"] = "super_secret_jwt_key_that_is_at_least_32_bytes_long_12345!"
            })
            .Build();

        services.AddInfrastructure(configuration);

        using var serviceProvider = services.BuildServiceProvider();
        using var scope = serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<RidePlannerDbContext>();

        var executionStrategy = dbContext.Database.CreateExecutionStrategy();

        Assert.NotNull(executionStrategy);
        Assert.True(executionStrategy.RetriesOnFailure, "Execution strategy must retry on transient failures for Neon serverless PostgreSQL.");
    }
}
