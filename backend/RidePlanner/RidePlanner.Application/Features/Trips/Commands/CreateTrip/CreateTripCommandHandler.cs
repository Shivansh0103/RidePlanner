using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Entities;

namespace RidePlanner.Application.Features.Trips.Commands.CreateTrip;

public sealed class CreateTripCommandHandler
{
    private readonly ITripRepository _tripRepository;

    public CreateTripCommandHandler(ITripRepository tripRepository)
    {
        _tripRepository = tripRepository;
    }

    public async Task<Trip> Handle(
        CreateTripCommand command,
        CancellationToken cancellationToken = default)
    {
        var trip = Trip.Create(
            command.Name,
            command.Description,
            command.StartDate,
            command.EndDate);

        trip.InitializeBudget();

        _tripRepository.Add(trip);

        await _tripRepository.SaveChangesAsync(cancellationToken);

        return trip;
    }
}