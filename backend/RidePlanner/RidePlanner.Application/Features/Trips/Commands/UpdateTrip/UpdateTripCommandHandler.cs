using MediatR;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Entities;

namespace RidePlanner.Application.Features.Trips.Commands.UpdateTrip;

public sealed class UpdateTripCommandHandler : IRequestHandler<UpdateTripCommand, Trip?>
{
    private readonly ITripRepository _tripRepository;

    public UpdateTripCommandHandler(ITripRepository tripRepository)
    {
        _tripRepository = tripRepository;
    }

    public async Task<Trip?> Handle(
        UpdateTripCommand request,
        CancellationToken cancellationToken = default)
    {
        var trip = await _tripRepository.GetByIdAsync(request.Id, cancellationToken);

        if (trip == null)
            return null;

        trip.Update(
            request.Name,
            request.Description,
            request.StartDate,
            request.EndDate);

        await _tripRepository.SaveChangesAsync(cancellationToken);

        return trip;
    }
}