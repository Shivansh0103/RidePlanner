using Microsoft.AspNetCore.DataProtection.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using RidePlanner.Infrastructure.Persistence;
using Xunit;

namespace RidePlanner.Api.IntegrationTests;

public class DataProtectionPersistenceTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;

    public DataProtectionPersistenceTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public void RidePlannerDbContext_ImplementsIDataProtectionKeyContext()
    {
        using var scope = _factory.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<RidePlannerDbContext>();

        Assert.IsAssignableFrom<IDataProtectionKeyContext>(dbContext);
    }

    [Fact]
    public async Task DataProtectionKeys_CanBeQueriedAndPersisted()
    {
        using var scope = _factory.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<RidePlannerDbContext>();

        var testKey = new DataProtectionKey
        {
            FriendlyName = "test-key-01",
            Xml = "<key id=\"test\"><data>test-value</data></key>"
        };

        dbContext.DataProtectionKeys.Add(testKey);
        await dbContext.SaveChangesAsync();

        var retrievedKey = await dbContext.DataProtectionKeys
            .FirstOrDefaultAsync(k => k.FriendlyName == "test-key-01");

        Assert.NotNull(retrievedKey);
        Assert.Equal("<key id=\"test\"><data>test-value</data></key>", retrievedKey.Xml);
    }
}
