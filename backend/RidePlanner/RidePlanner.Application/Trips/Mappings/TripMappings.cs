using RidePlanner.Application.Trips.DTOs;
using RidePlanner.Domain.Entities;

namespace RidePlanner.Application.Trips.Mappings;

public static class TripMappings
{
    public static TripResponse ToResponse(this Trip trip)
    {
        return new TripResponse(
            trip.Id,
            trip.Name,
            trip.Description,
            trip.StartDate,
            trip.EndDate,
            trip.CreatedAt,
            trip.UpdatedAt);
    }
}