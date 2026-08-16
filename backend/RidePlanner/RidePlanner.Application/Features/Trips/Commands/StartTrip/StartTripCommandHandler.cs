using MediatR;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Entities;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.Trips.Commands.StartTrip;

public sealed class StartTripCommandHandler : IRequestHandler<StartTripCommand, Trip>
{
    private readonly ITripRepository _tripRepository;

    public StartTripCommandHandler(ITripRepository tripRepository)
    {
        _tripRepository = tripRepository;
    }

    public async Task<Trip> Handle(
        StartTripCommand request,
        CancellationToken cancellationToken = default)
    {
        var trip = await _tripRepository.GetByIdAsync(request.TripId, cancellationToken);
        if (trip is null)
        {
            throw new DomainException($"Trip with ID {request.TripId} was not found.");
        }

        trip.Start(request.ActualStart);
        await _tripRepository.SaveChangesAsync(cancellationToken);

        return trip;
    }
}
