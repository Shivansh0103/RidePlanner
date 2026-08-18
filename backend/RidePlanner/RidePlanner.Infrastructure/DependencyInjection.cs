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
        var connectionString = configuration.GetConnectionString("RidePlannerDatabase");

        if (string.IsNullOrWhiteSpace(connectionString) || string.Equals(connectionString, "InMemory", StringComparison.OrdinalIgnoreCase))
        {
            services.AddDbContext<RidePlannerDbContext>(options =>
                options.UseInMemoryDatabase("RidePlannerDb"));
        }
        else
        {
            services.AddDbContext<RidePlannerDbContext>(options =>
                options.UseNpgsql(connectionString));
        }

        services.AddScoped<IUnitOfWork, UnitOfWork>();

        services.AddScoped<ITripRepository, TripRepository>();
        services.AddScoped<ITripStopRepository, TripStopRepository>();
        services.AddScoped<IChecklistRepository, ChecklistRepository>();
        services.AddScoped<IAccommodationRepository, AccommodationRepository>();
        services.AddScoped<IExpenseRepository, ExpenseRepository>();
        services.AddScoped<ITripDocumentRepository, TripDocumentRepository>();
        services.AddScoped<IEmergencyContactRepository, EmergencyContactRepository>();
        services.AddScoped<ITripMemoryRepository, TripMemoryRepository>();
        return services;
    }
}