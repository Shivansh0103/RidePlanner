using Microsoft.Extensions.DependencyInjection;
using RidePlanner.Application.Features.TripStops.Commands.CreateTripStop;
using RidePlanner.Application.Features.TripStops.Commands.DeleteTripStop;
using RidePlanner.Application.Features.TripStops.Commands.UpdateTripStop;
using RidePlanner.Application.Features.TripStops.Queries.GetTripStops;
using RidePlanner.Application.Features.Trips.Commands.CreateTrip;
using RidePlanner.Application.Features.Trips.Commands.DeleteTrip;
using RidePlanner.Application.Features.Trips.Commands.UpdateTrip;
using RidePlanner.Application.Features.Trips.Queries.GetTrip;
using RidePlanner.Application.Features.Trips.Queries.GetTrips;
using RidePlanner.Application.Features.TripStops.Commands.ReorderTripStops;
using RidePlanner.Application.Features.Budgets.Commands.CreateBudgetEstimate;
using RidePlanner.Application.Features.Budgets.Commands.UpdateBudgetEstimate;
using RidePlanner.Application.Features.Budgets.Commands.UpdateTripBudget;
using RidePlanner.Application.Features.Budgets.Queries.GetTripBudget;

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
        services.AddScoped<ReorderTripStopsCommandHandler>();
        services.AddScoped<GetTripStopsQueryHandler>();
        services.AddScoped<GetTripBudgetQueryHandler>();
        services.AddScoped<UpdateTripBudgetCommandHandler>();
        services.AddScoped<CreateBudgetEstimateCommandHandler>();
        services.AddScoped<UpdateBudgetEstimateCommandHandler>();
        return services;
    }
}