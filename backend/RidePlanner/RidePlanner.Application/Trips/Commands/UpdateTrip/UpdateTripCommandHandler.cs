using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Entities;

namespace RidePlanner.Application.Trips.Commands.UpdateTrip;

public sealed class UpdateTripCommandHandler
{
    private readonly ITripRepository _tripRepository;

    public UpdateTripCommandHandler(ITripRepository tripRepository)
    {
        _tripRepository = tripRepository;
    }

    public async Task<Trip>? Handle(
        UpdateTripCommand command,
        CancellationToken cancellationToken = default)
    {
        var trip = await _tripRepository.GetByIdAsync(command.Id, cancellationToken);

        if (trip == null)
            return null;

        trip.Update(
            command.Name,
            command.Description,
            command.StartDate,
            command.EndDate);

        await _tripRepository.SaveChangesAsync(cancellationToken);

        return trip;
    }
}