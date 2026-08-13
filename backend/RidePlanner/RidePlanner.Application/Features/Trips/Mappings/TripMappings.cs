using RidePlanner.Application.Features.Trips.DTOs;
using RidePlanner.Domain.Entities;

namespace RidePlanner.Application.Features.Trips.Mappings;

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
            trip.Status.ToString(),
            trip.StartedAt,
            trip.CompletedAt,
            trip.CreatedAt,
            trip.UpdatedAt);
    }
}