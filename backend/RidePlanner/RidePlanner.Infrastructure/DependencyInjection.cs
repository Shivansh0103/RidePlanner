using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using RidePlanner.Infrastructure.Persistence;

namespace RidePlanner.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<RidePlannerDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("RidePlannerDatabase")));

        return services;
    }
}