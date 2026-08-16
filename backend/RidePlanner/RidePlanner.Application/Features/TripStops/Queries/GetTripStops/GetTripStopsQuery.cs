using MediatR;
using RidePlanner.Application.Features.TripStops.DTOs;

namespace RidePlanner.Application.Features.TripStops.Queries.GetTripStops;

public sealed record GetTripStopsQuery(
    Guid TripId) : IRequest<IReadOnlyList<TripStopResponse>>;