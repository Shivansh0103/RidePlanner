using RidePlanner.Domain.Enums;

namespace RidePlanner.Domain.ValueObjects;

public class TripSummary
{
    public Guid TripId { get; }
    public string TripName { get; }
    public TripStatus Status { get; }
    public DateTimeOffset? StartedAt { get; }
    public DateTimeOffset? CompletedAt { get; }
    public double TotalDurationDays { get; }
    public int TotalStops { get; }
    public double TotalDistanceKm { get; }
    public decimal TargetBudget { get; }
    public decimal TotalExpenses { get; }
    public decimal BudgetVariance { get; }
    public int TotalAccommodations { get; }
    public int TotalNights { get; }
    public decimal TotalAccommodationCost { get; }
    public int TotalChecklistItems { get; }
    public int CompletedChecklistItems { get; }
    public double ChecklistCompletionPercentage { get; }

    public TripSummary(
        Guid tripId,
        string tripName,
        TripStatus status,
        DateTimeOffset? startedAt,
        DateTimeOffset? completedAt,
        int totalStops,
        double totalDistanceKm,
        decimal targetBudget,
        decimal totalExpenses,
        int totalAccommodations,
        int totalNights,
        decimal totalAccommodationCost,
        int totalChecklistItems,
        int completedChecklistItems)
    {
        TripId = tripId;
        TripName = tripName;
        Status = status;
        StartedAt = startedAt;
        CompletedAt = completedAt;
        TotalStops = totalStops;
        TotalDistanceKm = totalDistanceKm;
        TargetBudget = targetBudget;
        TotalExpenses = totalExpenses;
        BudgetVariance = targetBudget - totalExpenses;
        TotalAccommodations = totalAccommodations;
        TotalNights = totalNights;
        TotalAccommodationCost = totalAccommodationCost;
        TotalChecklistItems = totalChecklistItems;
        CompletedChecklistItems = completedChecklistItems;

        ChecklistCompletionPercentage = totalChecklistItems > 0
            ? Math.Round((double)completedChecklistItems / totalChecklistItems * 100, 1)
            : 100.0;

        if (startedAt.HasValue && completedAt.HasValue)
        {
            TotalDurationDays = Math.Round((completedAt.Value - startedAt.Value).TotalDays, 1);
        }
        else if (startedAt.HasValue)
        {
            TotalDurationDays = Math.Round((DateTimeOffset.UtcNow - startedAt.Value).TotalDays, 1);
        }
        else
        {
            TotalDurationDays = 0;
        }
    }
}
