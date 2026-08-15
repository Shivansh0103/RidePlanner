using Microsoft.Extensions.DependencyInjection;
using RidePlanner.Application.Features.TripStops.Commands.CreateTripStop;
using RidePlanner.Application.Features.TripStops.Commands.DeleteTripStop;
using RidePlanner.Application.Features.TripStops.Commands.UpdateTripStop;
using RidePlanner.Application.Features.TripStops.Queries.GetTripStops;
using RidePlanner.Application.Features.Trips.Commands.CreateTrip;
using RidePlanner.Application.Features.Trips.Commands.StartTrip;
using RidePlanner.Application.Features.Trips.Commands.CompleteTrip;
using RidePlanner.Application.Features.Trips.Commands.DeleteTrip;
using RidePlanner.Application.Features.Trips.Commands.UpdateTrip;
using RidePlanner.Application.Features.Trips.Queries.GetTrip;
using RidePlanner.Application.Features.Trips.Queries.GetTrips;
using RidePlanner.Application.Features.TripStops.Commands.ReorderTripStops;
using RidePlanner.Application.Features.Budgets.Commands.CalculateFuelEstimate;
using RidePlanner.Application.Features.Budgets.Commands.CreateBudgetEstimate;
using RidePlanner.Application.Features.Budgets.Commands.DeleteBudgetEstimate;
using RidePlanner.Application.Features.Budgets.Commands.UpdateBudgetEstimate;
using RidePlanner.Application.Features.Budgets.Commands.UpdateTripBudget;
using RidePlanner.Application.Features.Budgets.Queries.GetTripBudget;
using RidePlanner.Application.Features.Checklists.Commands.CreateCategory;
using RidePlanner.Application.Features.Checklists.Commands.CreateItem;
using RidePlanner.Application.Features.Checklists.Commands.DeleteCategory;
using RidePlanner.Application.Features.Checklists.Commands.DeleteItem;
using RidePlanner.Application.Features.Checklists.Commands.ToggleItem;
using RidePlanner.Application.Features.Checklists.Commands.UpdateCategory;
using RidePlanner.Application.Features.Checklists.Commands.UpdateItem;
using RidePlanner.Application.Features.Checklists.Queries.GetTripChecklist;
using RidePlanner.Application.Features.Accommodations.Commands.CreateAccommodation;
using RidePlanner.Application.Features.Accommodations.Commands.DeleteAccommodation;
using RidePlanner.Application.Features.Accommodations.Commands.UpdateAccommodation;
using RidePlanner.Application.Features.Accommodations.Queries.GetAccommodationById;
using RidePlanner.Application.Features.Accommodations.Queries.GetAccommodationsByTripId;
using RidePlanner.Application.Features.Expenses.Commands.CreateExpense;
using RidePlanner.Application.Features.Expenses.Commands.DeleteExpense;
using RidePlanner.Application.Features.Expenses.Commands.UpdateExpense;
using RidePlanner.Application.Features.Expenses.Queries.GetTripExpenses;

namespace RidePlanner.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(
        this IServiceCollection services)
    {
        services.AddScoped<CreateTripCommandHandler>();
        services.AddScoped<UpdateTripCommandHandler>();
        services.AddScoped<DeleteTripCommandHandler>();
        services.AddScoped<StartTripCommandHandler>();
        services.AddScoped<CompleteTripCommandHandler>();
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
        services.AddScoped<DeleteBudgetEstimateCommandHandler>();
        services.AddScoped<CalculateFuelEstimateCommandHandler>();
        services.AddScoped<GetTripChecklistQueryHandler>();
        services.AddScoped<CreateChecklistCategoryCommandHandler>();
        services.AddScoped<UpdateChecklistCategoryCommandHandler>();
        services.AddScoped<DeleteChecklistCategoryCommandHandler>();
        services.AddScoped<CreateChecklistItemCommandHandler>();
        services.AddScoped<UpdateChecklistItemCommandHandler>();
        services.AddScoped<ToggleChecklistItemCommandHandler>();
        services.AddScoped<DeleteChecklistItemCommandHandler>();
        services.AddScoped<CreateAccommodationCommandHandler>();
        services.AddScoped<UpdateAccommodationCommandHandler>();
        services.AddScoped<DeleteAccommodationCommandHandler>();
        services.AddScoped<GetAccommodationsByTripIdQueryHandler>();
        services.AddScoped<GetAccommodationByIdQueryHandler>();

        services.AddScoped<CreateExpenseCommandHandler>();
        services.AddScoped<UpdateExpenseCommandHandler>();
        services.AddScoped<DeleteExpenseCommandHandler>();
        services.AddScoped<GetTripExpensesQueryHandler>();

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
        return services;
    }
}


