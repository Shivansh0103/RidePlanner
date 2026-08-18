using RidePlanner.Domain.Entities;

namespace RidePlanner.Domain.Services;

public static class TripStopReconciler
{
    public static void Reconcile(IEnumerable<TripStop> stops)
    {
        var sorted = stops
            .OrderBy(s => s.ArrivalDate)
            .ThenBy(s => s.DepartureDate)
            .ThenBy(s => s.DisplayOrder > 0 ? s.DisplayOrder : int.MaxValue)
            .ThenBy(s => s.Id)
            .ToList();

        for (int i = 0; i < sorted.Count; i++)
        {
            sorted[i].SetDisplayOrder(i + 1);
        }
    }
}
