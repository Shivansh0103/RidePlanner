using RidePlanner.Application.Features.TripStops.DTOs;
using RidePlanner.Domain.Entities;

namespace RidePlanner.Application.Features.TripStops.Mappings;

public static class TripStopMappings
{
    public static TripStopResponse ToResponse(this TripStop tripStop)
    {
        return new TripStopResponse(
            tripStop.Id,
            tripStop.Name,
            tripStop.ArrivalDate,
            tripStop.DepartureDate,
            tripStop.Notes,
            tripStop.DisplayOrder);
    }
}