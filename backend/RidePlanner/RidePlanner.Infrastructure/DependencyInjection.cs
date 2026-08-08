using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Infrastructure.Persistence;
using RidePlanner.Infrastructure.Persistence.Repositories;

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

        services.AddScoped<ITripRepository, TripRepository>();
        services.AddScoped<ITripStopRepository, TripStopRepository>();
        services.AddScoped<IChecklistRepository, ChecklistRepository>();
        return services;
    }
}