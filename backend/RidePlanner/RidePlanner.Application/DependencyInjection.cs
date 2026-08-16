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


        return services;
    }
}