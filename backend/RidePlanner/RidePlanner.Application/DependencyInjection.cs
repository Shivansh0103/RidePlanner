using Microsoft.Extensions.DependencyInjection;
using RidePlanner.Application.Trips.Commands.CreateTrip;
using RidePlanner.Application.Trips.Commands.UpdateTrip;
using RidePlanner.Application.Trips.Commands.DeleteTrip;
using RidePlanner.Application.Trips.Queries.GetTrip;
using RidePlanner.Application.Trips.Queries.GetTrips;
namespace RidePlanner.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(
        this IServiceCollection services)
    {
        services.AddScoped<CreateTripCommandHandler>();
        services.AddScoped<UpdateTripCommandHandler>();
        services.AddScoped<DeleteTripCommandHandler>();
        services.AddScoped<GetTripQueryHandler>();
        services.AddScoped<GetTripsQueryHandler>();
        return services;
    }
}