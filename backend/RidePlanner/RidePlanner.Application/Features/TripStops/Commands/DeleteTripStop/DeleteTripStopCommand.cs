using MediatR;

namespace RidePlanner.Application.Features.TripStops.Commands.DeleteTripStop;

public sealed record DeleteTripStopCommand(
    Guid TripId,
    Guid StopId) : IRequest;