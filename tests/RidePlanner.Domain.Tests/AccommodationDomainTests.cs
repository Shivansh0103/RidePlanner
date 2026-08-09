using RidePlanner.Domain.Entities;
using RidePlanner.Domain.Entities.Budget;
using RidePlanner.Domain.Enums;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Domain.Tests;

public class AccommodationDomainTests
{
    [Fact]
    public void Accommodation_Creation_Validates_Dates_And_Derives_Nights()
    {
        var tripId = Guid.NewGuid();
        var stopId = Guid.NewGuid();
        var checkIn = new DateOnly(2026, 8, 15);
        var checkOut = new DateOnly(2026, 8, 18);

        var accommodation = Accommodation.Create(
            tripId,
            stopId,
            AccommodationType.Hotel,
            checkIn,
            checkOut,
            new TimeOnly(14, 0),
            new TimeOnly(11, 0),
            "CONF123",
            "John Innkeeper",
            "+1234567890",
            "https://hotel.com",
            "Near city center",
            8500m);

        Assert.Equal(tripId, accommodation.TripId);
        Assert.Equal(stopId, accommodation.TripStopId);
        Assert.Equal(3, accommodation.Nights);
        Assert.Equal(8500m, accommodation.Cost);
        Assert.Equal(AccommodationType.Hotel, accommodation.Type);
    }

    [Fact]
    public void Accommodation_Throws_When_CheckOut_Before_CheckIn()
    {
        var tripId = Guid.NewGuid();
        var stopId = Guid.NewGuid();
        var checkIn = new DateOnly(2026, 8, 18);
        var checkOut = new DateOnly(2026, 8, 15);

        Assert.Throws<DomainException>(() =>
            Accommodation.Create(
                tripId,
                stopId,
                AccommodationType.Hostel,
                checkIn,
                checkOut,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                5000m));
    }

    [Fact]
    public void Accommodation_Throws_When_Cost_Is_Negative()
    {
        var tripId = Guid.NewGuid();
        var stopId = Guid.NewGuid();
        var checkIn = new DateOnly(2026, 8, 15);
        var checkOut = new DateOnly(2026, 8, 16);

        Assert.Throws<DomainException>(() =>
            Accommodation.Create(
                tripId,
                stopId,
                AccommodationType.Resort,
                checkIn,
                checkOut,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                -100m));
    }

    [Fact]
    public void TripStop_Allows_Null_PlaceId_For_Manual_Stays()
    {
        var tripId = Guid.NewGuid();
        var stop = TripStop.Create(
            tripId,
            "Custom Manual Hotel",
            null, // Null PlaceId
            "123 Mountain View Road",
            32.2432,
            77.1892,
            TripStopCategory.Hotel,
            new DateOnly(2026, 8, 15),
            new DateOnly(2026, 8, 17),
            "Manual entry notes",
            1);

        Assert.Null(stop.PlaceId);
        Assert.Equal("Custom Manual Hotel", stop.Name);
    }

    [Fact]
    public void Budget_SyncAccommodationEstimate_PositiveCost_Creates_Linked_Estimate()
    {
        var tripId = Guid.NewGuid();
        var budget = new TripBudget(tripId, 50000m);
        var accommodationId = Guid.NewGuid();
        const string stayName = "The Grand Hotel";
        const decimal cost = 8500m;

        var estimate = budget.SyncAccommodationEstimate(accommodationId, stayName, cost);

        Assert.NotNull(estimate);
        Assert.Equal(1, budget.Estimates.Count);
        Assert.Equal(BudgetCategoryType.Accommodation, estimate.Category);
        Assert.Equal(stayName, estimate.Title);
        Assert.Equal(cost, estimate.EstimatedAmount);
        Assert.Equal(accommodationId, estimate.AccommodationId);
    }

    [Fact]
    public void Budget_SyncAccommodationEstimate_ZeroCost_Removes_Linked_Estimate()
    {
        var tripId = Guid.NewGuid();
        var budget = new TripBudget(tripId, 50000m);
        var accommodationId = Guid.NewGuid();

        // 1. Create with positive cost
        budget.SyncAccommodationEstimate(accommodationId, "Hotel Paradise", 6000m);
        Assert.Single(budget.Estimates);

        // 2. Sync with 0 cost
        var result = budget.SyncAccommodationEstimate(accommodationId, "Hotel Paradise", 0m);

        Assert.Null(result);
        Assert.Empty(budget.Estimates);
    }

    [Fact]
    public void Budget_SyncAccommodationEstimate_Zero_To_Positive_Creates_New_Estimate()
    {
        var tripId = Guid.NewGuid();
        var budget = new TripBudget(tripId, 50000m);
        var accommodationId = Guid.NewGuid();

        // 1. Sync with 0 cost -> No estimate
        var initial = budget.SyncAccommodationEstimate(accommodationId, "Free Campsite", 0m);
        Assert.Null(initial);
        Assert.Empty(budget.Estimates);

        // 2. Sync with positive cost -> Creates estimate
        var created = budget.SyncAccommodationEstimate(accommodationId, "Free Campsite (Paid upgrade)", 2500m);
        Assert.NotNull(created);
        Assert.Single(budget.Estimates);
        Assert.Equal(2500m, created.EstimatedAmount);
        Assert.Equal(accommodationId, created.AccommodationId);
    }

    [Fact]
    public void Budget_SyncAccommodationEstimate_Preserves_Manual_Unlinked_Estimates()
    {
        var tripId = Guid.NewGuid();
        var budget = new TripBudget(tripId, 50000m);
        var accommodationId = Guid.NewGuid();

        // Add generic manual estimate directly to budget (AccommodationId = null)
        budget.AddEstimate(BudgetCategoryType.Accommodation, "Generic Hotel Buffer", 10000m);
        Assert.Single(budget.Estimates);

        // Sync stay cost
        budget.SyncAccommodationEstimate(accommodationId, "Booked Manali Stay", 7500m);

        Assert.Equal(2, budget.Estimates.Count);
        Assert.Contains(budget.Estimates, e => e.Title == "Generic Hotel Buffer" && e.AccommodationId == null);
        Assert.Contains(budget.Estimates, e => e.Title == "Booked Manali Stay" && e.AccommodationId == accommodationId);

        // Remove stay estimate
        budget.RemoveAccommodationEstimate(accommodationId);

        Assert.Single(budget.Estimates);
        Assert.Equal("Generic Hotel Buffer", budget.Estimates.First().Title);
    }
}
