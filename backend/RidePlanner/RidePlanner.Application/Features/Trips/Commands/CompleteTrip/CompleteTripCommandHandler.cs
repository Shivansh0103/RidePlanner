using MediatR;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Entities;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.Trips.Commands.CompleteTrip;

public sealed class CompleteTripCommandHandler : IRequestHandler<CompleteTripCommand, Trip>
{
    private readonly ITripRepository _tripRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CompleteTripCommandHandler(
        ITripRepository tripRepository,
        IUnitOfWork unitOfWork)
    {
        _tripRepository = tripRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Trip> Handle(
        CompleteTripCommand request,
        CancellationToken cancellationToken = default)
    {
        var trip = await _tripRepository.GetByIdAsync(request.TripId, cancellationToken);
        if (trip is null)
        {
            throw new DomainException($"Trip with ID {request.TripId} was not found.");
        }

        trip.Complete(request.ActualCompletion);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return trip;
    }
}
