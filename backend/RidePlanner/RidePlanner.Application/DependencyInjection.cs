using Microsoft.Extensions.DependencyInjection;
using RidePlanner.Application.Common.Behaviors;

namespace RidePlanner.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(
        this IServiceCollection services)
    {
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(typeof(DependencyInjection).Assembly);
            cfg.AddOpenBehavior(typeof(LoggingBehavior<,>));
        });



        services.AddScoped<RidePlanner.Application.Features.Readiness.Queries.GetTripReadiness.GetTripReadinessQueryHandler>();
        services.AddScoped<RidePlanner.Application.Features.Summary.Queries.GetTripSummary.GetTripSummaryQueryHandler>();

        services.AddScoped<RidePlanner.Application.Features.Memories.Commands.CreateTripMemory.CreateTripMemoryCommandHandler>();
        services.AddScoped<RidePlanner.Application.Features.Memories.Commands.UpdateTripMemory.UpdateTripMemoryCommandHandler>();
        services.AddScoped<RidePlanner.Application.Features.Memories.Commands.DeleteTripMemory.DeleteTripMemoryCommandHandler>();
        services.AddScoped<RidePlanner.Application.Features.Memories.Queries.GetTripMemories.GetTripMemoriesQueryHandler>();
        services.AddScoped<RidePlanner.Application.Features.Memories.Queries.GetTripMemory.GetTripMemoryQueryHandler>();
        return services;
    }
}