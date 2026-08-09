namespace RidePlanner.Application.Features.Accommodations.Queries.GetAccommodationById;

public sealed record GetAccommodationByIdQuery(Guid TripId, Guid Id);
