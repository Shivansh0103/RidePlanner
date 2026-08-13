using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Entities;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.Trips.Commands.StartTrip;

public sealed class StartTripCommandHandler
{
    private readonly ITripRepository _tripRepository;

    public StartTripCommandHandler(ITripRepository tripRepository)
    {
        _tripRepository = tripRepository;
    }

    public async Task<Trip> Handle(
        StartTripCommand command,
        CancellationToken cancellationToken = default)
    {
        var trip = await _tripRepository.GetByIdAsync(command.TripId, cancellationToken);
        if (trip is null)
        {
            throw new DomainException($"Trip with ID {command.TripId} was not found.");
        }

        trip.Start(command.ActualStart);
        await _tripRepository.SaveChangesAsync(cancellationToken);

        return trip;
    }
}
