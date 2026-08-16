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

        services.AddScoped<RidePlanner.Application.Features.TravelDocuments.Commands.CreateTripDocument.CreateTripDocumentCommandHandler>();
        services.AddScoped<RidePlanner.Application.Features.TravelDocuments.Commands.UpdateTripDocument.UpdateTripDocumentCommandHandler>();
        services.AddScoped<RidePlanner.Application.Features.TravelDocuments.Commands.DeleteTripDocument.DeleteTripDocumentCommandHandler>();
        services.AddScoped<RidePlanner.Application.Features.TravelDocuments.Queries.GetTripDocuments.GetTripDocumentsQueryHandler>();
        services.AddScoped<RidePlanner.Application.Features.TravelDocuments.Queries.GetTripDocument.GetTripDocumentQueryHandler>();

        services.AddScoped<RidePlanner.Application.Features.EmergencyContacts.Commands.CreateEmergencyContact.CreateEmergencyContactCommandHandler>();
        services.AddScoped<RidePlanner.Application.Features.EmergencyContacts.Commands.UpdateEmergencyContact.UpdateEmergencyContactCommandHandler>();
        services.AddScoped<RidePlanner.Application.Features.EmergencyContacts.Commands.DeleteEmergencyContact.DeleteEmergencyContactCommandHandler>();
        services.AddScoped<RidePlanner.Application.Features.EmergencyContacts.Queries.GetEmergencyContacts.GetEmergencyContactsQueryHandler>();
        services.AddScoped<RidePlanner.Application.Features.EmergencyContacts.Queries.GetEmergencyContact.GetEmergencyContactQueryHandler>();

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