using MediatR;
using RidePlanner.Domain.Entities;

namespace RidePlanner.Application.Features.Trips.Queries.GetTrips;

public sealed record GetTripsQuery() : IRequest<IReadOnlyList<Trip>>;
