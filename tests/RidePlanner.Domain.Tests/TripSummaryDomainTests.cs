using RidePlanner.Domain.Enums;
using RidePlanner.Domain.ValueObjects;

namespace RidePlanner.Domain.Tests;

public class TripSummaryDomainTests
{
    [Fact]
    public void TripSummary_Calculation_DerivesVarianceDurationAndPercentagesCorrectly()
    {
        var tripId = Guid.NewGuid();
        var startedAt = DateTimeOffset.UtcNow.AddDays(-5);
        var completedAt = DateTimeOffset.UtcNow;

        var summary = new TripSummary(
            tripId,
            "Leh Ladakh Expedition",
            TripStatus.Completed,
            startedAt,
            completedAt,
            totalStops: 8,
            totalDistanceKm: 1250.5,
            targetBudget: 50000m,
            totalExpenses: 42000m,
            totalAccommodations: 4,
            totalNights: 5,
            totalAccommodationCost: 18000m,
            totalChecklistItems: 20,
            completedChecklistItems: 18);

        Assert.Equal(tripId, summary.TripId);
        Assert.Equal("Leh Ladakh Expedition", summary.TripName);
        Assert.Equal(TripStatus.Completed, summary.Status);
        Assert.Equal(8000m, summary.BudgetVariance); // 50,000 - 42,000
        Assert.Equal(90.0, summary.ChecklistCompletionPercentage); // 18 / 20 * 100
        Assert.Equal(5.0, summary.TotalDurationDays);
    }
}
