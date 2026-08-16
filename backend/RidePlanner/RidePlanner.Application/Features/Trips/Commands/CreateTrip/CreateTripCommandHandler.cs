using MediatR;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Entities;

namespace RidePlanner.Application.Features.Trips.Commands.CreateTrip;

public sealed class CreateTripCommandHandler : IRequestHandler<CreateTripCommand, Trip>
{
    private readonly ITripRepository _tripRepository;

    public CreateTripCommandHandler(ITripRepository tripRepository)
    {
        _tripRepository = tripRepository;
    }

    public async Task<Trip> Handle(
        CreateTripCommand request,
        CancellationToken cancellationToken = default)
    {
        var trip = Trip.Create(
            request.Name,
            request.Description,
            request.StartDate,
            request.EndDate);

        trip.InitializeBudget();
        trip.InitializeDefaultChecklist();

        _tripRepository.Add(trip);

        await _tripRepository.SaveChangesAsync(cancellationToken);

        return trip;
    }
}