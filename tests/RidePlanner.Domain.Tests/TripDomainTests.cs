using RidePlanner.Domain.Entities;
using RidePlanner.Domain.Enums;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Domain.Tests;

public class TripDomainTests
{
    [Fact]
    public void Trip_Creation_Defaults_To_Planning_Status_With_Null_Lifecycle_Timestamps()
    {
        var trip = Trip.Create(
            "Ladakh Adventure",
            "Mountain road trip",
            new DateOnly(2026, 6, 20),
            new DateOnly(2026, 6, 30));

        Assert.Equal(TripStatus.Planning, trip.Status);
        Assert.Null(trip.StartedAt);
        Assert.Null(trip.CompletedAt);
    }

    [Fact]
    public void Trip_Start_Sets_Status_To_Active_And_Populates_StartedAt()
    {
        var trip = Trip.Create(
            "South India Ride",
            "Coastal route",
            new DateOnly(2026, 9, 1),
            new DateOnly(2026, 9, 10));

        var actualStart = new DateTimeOffset(2026, 8, 30, 8, 0, 0, TimeSpan.Zero);
        trip.Start(actualStart);

        Assert.Equal(TripStatus.Active, trip.Status);
        Assert.Equal(actualStart, trip.StartedAt);
        Assert.Null(trip.CompletedAt);
    }

    [Fact]
    public void Trip_AutoActivate_Changes_Planning_To_Active_Without_Setting_StartedAt()
    {
        var trip = Trip.Create(
            "Spiti Valley",
            "Circuit ride",
            new DateOnly(2026, 7, 1),
            new DateOnly(2026, 7, 10));

        trip.AutoActivate();

        Assert.Equal(TripStatus.Active, trip.Status);
        Assert.Null(trip.StartedAt);
    }

    [Fact]
    public void Trip_Complete_Sets_Status_To_Completed_And_Populates_CompletedAt()
    {
        var trip = Trip.Create(
            "Goa Monsoon Ride",
            "Weekend getaway",
            new DateOnly(2026, 8, 1),
            new DateOnly(2026, 8, 5));

        trip.Start();
        var completionTime = DateTimeOffset.UtcNow;
        trip.Complete(completionTime);

        Assert.Equal(TripStatus.Completed, trip.Status);
        Assert.NotNull(trip.StartedAt);
        Assert.Equal(completionTime, trip.CompletedAt);
    }

    [Fact]
    public void Trip_Start_Throws_When_Already_Completed()
    {
        var trip = Trip.Create("Test Trip", "Desc", new DateOnly(2026, 6, 1), new DateOnly(2026, 6, 5));
        trip.Complete();

        Assert.Throws<DomainException>(() => trip.Start());
    }

    [Fact]
    public void Trip_Complete_Throws_When_Already_Completed()
    {
        var trip = Trip.Create("Test Trip", "Desc", new DateOnly(2026, 6, 1), new DateOnly(2026, 6, 5));
        trip.Complete();

        Assert.Throws<DomainException>(() => trip.Complete());
    }
}
