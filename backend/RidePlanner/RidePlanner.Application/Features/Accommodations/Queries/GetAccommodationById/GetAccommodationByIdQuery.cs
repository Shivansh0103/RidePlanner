using MediatR;
using RidePlanner.Application.Features.Accommodations.DTOs;

namespace RidePlanner.Application.Features.Accommodations.Queries.GetAccommodationById;

public sealed record GetAccommodationByIdQuery(Guid TripId, Guid Id) : IRequest<AccommodationResponse>;
