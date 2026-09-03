using MediatR;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Entities;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.Trips.Commands.CompleteTrip;

public sealed class CompleteTripCommandHandler : IRequestHandler<CompleteTripCommand, Trip>
{
    private readonly ITripRepository _tripRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;

    public CompleteTripCommandHandler(
        ITripRepository tripRepository,
        IUnitOfWork unitOfWork,
        ICurrentUserService currentUserService)
    {
        _tripRepository = tripRepository;
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
    }

    public async Task<Trip> Handle(
        CompleteTripCommand request,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUserService.UserId
            ?? throw new UnauthorizedException("User is not authenticated.");

        var trip = await _tripRepository.GetByIdAsync(request.TripId, currentUserId, cancellationToken);
        if (trip is null)
        {
            throw new NotFoundException("Trip", request.TripId);
        }

        trip.Complete(request.ActualCompletion);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return trip;
    }
}
