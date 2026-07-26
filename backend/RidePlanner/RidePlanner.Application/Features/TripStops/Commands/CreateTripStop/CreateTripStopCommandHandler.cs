using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Entities;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.TripStops.Commands.CreateTripStop;

public sealed class CreateTripStopCommandHandler
{
    private readonly ITripRepository _tripRepository;
    private readonly ITripStopRepository _tripStopRepository;

    public CreateTripStopCommandHandler(
        ITripRepository tripRepository,
        ITripStopRepository tripStopRepository)
    {
        _tripRepository = tripRepository;
        _tripStopRepository = tripStopRepository;
    }

    public async Task<Guid> Handle(
        CreateTripStopCommand command,
        CancellationToken cancellationToken)
    {
        var trip = await _tripRepository.GetByIdAsync(
            command.TripId,
            cancellationToken);

        if (trip is null)
            throw new DomainException("Trip not found.");

        var tripStop = TripStop.Create(
            command.TripId,
            command.Name,
            command.ArrivalDate,
            command.DepartureDate,
            command.Notes,
            command.DisplayOrder);

        _tripStopRepository.Add(tripStop);

        await _tripStopRepository.SaveChangesAsync(cancellationToken);

        return tripStop.Id;
    }
}