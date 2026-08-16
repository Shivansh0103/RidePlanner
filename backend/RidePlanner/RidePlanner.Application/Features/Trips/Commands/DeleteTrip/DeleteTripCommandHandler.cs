using MediatR;
using RidePlanner.Application.Abstractions.Persistence;

namespace RidePlanner.Application.Features.Trips.Commands.DeleteTrip;

public sealed class DeleteTripCommandHandler : IRequestHandler<DeleteTripCommand>
{
    private readonly ITripRepository _tripRepository;

    public DeleteTripCommandHandler(ITripRepository tripRepository)
    {
        _tripRepository = tripRepository;
    }

    public async Task Handle(
        DeleteTripCommand request,
        CancellationToken cancellationToken = default)
    {
        var trip = await _tripRepository.GetByIdAsync(request.Id, cancellationToken);

        if (trip is null)
            return;

        await _tripRepository.DeleteAsync(trip, cancellationToken);

        await _tripRepository.SaveChangesAsync(cancellationToken);
    }
}
