using Microsoft.Extensions.DependencyInjection;
using RidePlanner.Application.Features.TripStops.Commands.CreateTripStop;
using RidePlanner.Application.Features.TripStops.Commands.DeleteTripStop;
using RidePlanner.Application.Features.TripStops.Commands.UpdateTripStop;
using RidePlanner.Application.Features.TripStops.Queries.GetTripStops;
using RidePlanner.Application.Trips.Commands.CreateTrip;
using RidePlanner.Application.Trips.Commands.DeleteTrip;
using RidePlanner.Application.Trips.Commands.UpdateTrip;
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
        services.AddScoped<CreateTripStopCommandHandler>();
        services.AddScoped<UpdateTripStopCommandHandler>();
        services.AddScoped<DeleteTripStopCommandHandler>();
        services.AddScoped<GetTripStopsQueryHandler>();
        return services;
    }
}