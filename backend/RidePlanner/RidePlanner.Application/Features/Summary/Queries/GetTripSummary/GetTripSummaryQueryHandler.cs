using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Summary.DTOs;
using RidePlanner.Domain.ValueObjects;

namespace RidePlanner.Application.Features.Summary.Queries.GetTripSummary;

public sealed class GetTripSummaryQueryHandler
{
    private readonly ITripRepository _tripRepository;
    private readonly ITripStopRepository _stopRepository;
    private readonly IExpenseRepository _expenseRepository;
    private readonly IAccommodationRepository _accommodationRepository;
    private readonly IChecklistRepository _checklistRepository;

    public GetTripSummaryQueryHandler(
        ITripRepository tripRepository,
        ITripStopRepository stopRepository,
        IExpenseRepository expenseRepository,
        IAccommodationRepository accommodationRepository,
        IChecklistRepository checklistRepository)
    {
        _tripRepository = tripRepository;
        _stopRepository = stopRepository;
        _expenseRepository = expenseRepository;
        _accommodationRepository = accommodationRepository;
        _checklistRepository = checklistRepository;
    }

    public async Task<TripSummaryDto?> Handle(
        GetTripSummaryQuery query,
        CancellationToken cancellationToken = default)
    {
        var trip = await _tripRepository.GetByIdAsync(query.TripId, cancellationToken);
        if (trip is null)
        {
            return null;
        }

        var stops = await _stopRepository.GetByTripIdAsync(query.TripId, cancellationToken);
        var expenses = trip.Budget != null
            ? await _expenseRepository.GetByTripBudgetIdAsync(trip.Budget.Id, cancellationToken)
            : Array.Empty<RidePlanner.Domain.Entities.Budget.Expense>();
        var accommodations = await _accommodationRepository.GetByTripIdAsync(query.TripId, cancellationToken);
        var categories = await _checklistRepository.GetCategoriesByTripIdAsync(query.TripId, cancellationToken);

        var totalExpenses = expenses.Sum(e => e.Amount);
        var targetBudget = trip.Budget?.TargetBudget ?? 0m;

        var totalNights = accommodations.Sum(a => a.Nights);
        var totalAccommodationCost = accommodations.Sum(a => a.Cost);


        var allItems = categories.SelectMany(c => c.Items).ToList();
        var completedItems = allItems.Count(i => i.IsCompleted);

        var domainSummary = new TripSummary(
            trip.Id,
            trip.Name,
            trip.Status,
            trip.StartedAt,
            trip.CompletedAt,
            totalStops: stops.Count,
            totalDistanceKm: 0, // Computed dynamically or from route summary
            targetBudget: targetBudget,
            totalExpenses: totalExpenses,
            totalAccommodations: accommodations.Count,
            totalNights: totalNights,
            totalAccommodationCost: totalAccommodationCost,
            totalChecklistItems: allItems.Count,
            completedChecklistItems: completedItems);

        return new TripSummaryDto
        {
            TripId = domainSummary.TripId,
            TripName = domainSummary.TripName,
            Status = domainSummary.Status,
            StartedAt = domainSummary.StartedAt,
            CompletedAt = domainSummary.CompletedAt,
            TotalDurationDays = domainSummary.TotalDurationDays,
            TotalStops = domainSummary.TotalStops,
            TotalDistanceKm = domainSummary.TotalDistanceKm,
            TargetBudget = domainSummary.TargetBudget,
            TotalExpenses = domainSummary.TotalExpenses,
            BudgetVariance = domainSummary.BudgetVariance,
            TotalAccommodations = domainSummary.TotalAccommodations,
            TotalNights = domainSummary.TotalNights,
            TotalAccommodationCost = domainSummary.TotalAccommodationCost,
            TotalChecklistItems = domainSummary.TotalChecklistItems,
            CompletedChecklistItems = domainSummary.CompletedChecklistItems,
            ChecklistCompletionPercentage = domainSummary.ChecklistCompletionPercentage,
        };
    }
}
