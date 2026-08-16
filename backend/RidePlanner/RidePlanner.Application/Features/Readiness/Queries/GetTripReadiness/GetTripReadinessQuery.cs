using MediatR;
using RidePlanner.Application.Features.Readiness.DTOs;

namespace RidePlanner.Application.Features.Readiness.Queries.GetTripReadiness;

public sealed record GetTripReadinessQuery(Guid TripId) : IRequest<TripReadinessDto?>;
