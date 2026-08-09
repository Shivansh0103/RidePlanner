using RidePlanner.Application.Features.Accommodations.DTOs;

namespace RidePlanner.Application.Features.Accommodations.Queries.GetAccommodationsByTripId;

public sealed record GetAccommodationsByTripIdQuery(Guid TripId);
