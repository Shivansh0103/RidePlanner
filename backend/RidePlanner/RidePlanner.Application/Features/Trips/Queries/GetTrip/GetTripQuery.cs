using MediatR;
using RidePlanner.Domain.Entities;

namespace RidePlanner.Application.Features.Trips.Queries.GetTrip;

public sealed record GetTripQuery(Guid Id) : IRequest<Trip?>;