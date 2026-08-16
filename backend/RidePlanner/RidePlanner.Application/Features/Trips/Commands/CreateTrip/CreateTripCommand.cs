using MediatR;
using RidePlanner.Domain.Entities;

namespace RidePlanner.Application.Features.Trips.Commands.CreateTrip;

public sealed record CreateTripCommand(
    string Name,
    string? Description,
    DateOnly StartDate,
    DateOnly EndDate) : IRequest<Trip>;