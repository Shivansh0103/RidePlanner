using RidePlanner.Domain.ValueObjects;

namespace RidePlanner.Domain.Tests;

public class TripReadinessDomainTests
{
    [Fact]
    public void TripReadiness_CalculatesScoreAndIsReadyCorrectly()
    {
        var items = new List<ReadinessItem>
        {
            new("Route", "Route & Stops", isPassed: true, isRequired: true, "Route has 3 stops."),
            new("Checklist", "Required Items", isPassed: true, isRequired: true, "All required items packed."),
            new("Documents", "Travel Documents", isPassed: true, isRequired: true, "License & Insurance present."),
            new("Contacts", "Emergency Contacts", isPassed: true, isRequired: true, "Primary contact added."),
            new("Accommodations", "Stay Reservations", isPassed: false, isRequired: false, "No stay booked yet."),
        };

        var readiness = new TripReadiness(items);

        Assert.Equal(80, readiness.ScorePercentage);
        Assert.True(readiness.IsReady);
        Assert.Equal(5, readiness.Items.Count);
    }

    [Fact]
    public void TripReadiness_WhenRequiredItemFails_IsNotReady()
    {
        var items = new List<ReadinessItem>
        {
            new("Route", "Route & Stops", isPassed: true, isRequired: true, "Route configured."),
            new("Checklist", "Required Items", isPassed: false, isRequired: true, "Missing required packed items."),
        };

        var readiness = new TripReadiness(items);

        Assert.Equal(50, readiness.ScorePercentage);
        Assert.False(readiness.IsReady);
    }
}
