using RidePlanner.Domain.Entities;
using RidePlanner.Domain.Enums;

namespace RidePlanner.Application.Features.Trips.Services;

public static class TripLifecycleService
{
    public static void SynchronizeLifecycle(Trip trip, DateOnly currentDate)
    {
        if (trip.Status == TripStatus.Planning && trip.StartDate <= currentDate)
        {
            trip.AutoActivate();
        }
    }

    public static void SynchronizeLifecycle(IEnumerable<Trip> trips, DateOnly currentDate)
    {
        foreach (var trip in trips)
        {
            SynchronizeLifecycle(trip, currentDate);
        }
    }
}
