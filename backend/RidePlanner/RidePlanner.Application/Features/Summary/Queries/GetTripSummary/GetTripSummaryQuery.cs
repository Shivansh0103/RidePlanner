using MediatR;
using RidePlanner.Application.Features.Summary.DTOs;

namespace RidePlanner.Application.Features.Summary.Queries.GetTripSummary;

public sealed record GetTripSummaryQuery(Guid TripId) : IRequest<TripSummaryDto?>;
