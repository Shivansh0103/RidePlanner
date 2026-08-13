using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Entities;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.Trips.Commands.CompleteTrip;

public sealed class CompleteTripCommandHandler
{
    private readonly ITripRepository _tripRepository;

    public CompleteTripCommandHandler(ITripRepository tripRepository)
    {
        _tripRepository = tripRepository;
    }

    public async Task<Trip> Handle(
        CompleteTripCommand command,
        CancellationToken cancellationToken = default)
    {
        var trip = await _tripRepository.GetByIdAsync(command.TripId, cancellationToken);
        if (trip is null)
        {
            throw new DomainException($"Trip with ID {command.TripId} was not found.");
        }

        trip.Complete(command.ActualCompletion);
        await _tripRepository.SaveChangesAsync(cancellationToken);

        return trip;
    }
}
