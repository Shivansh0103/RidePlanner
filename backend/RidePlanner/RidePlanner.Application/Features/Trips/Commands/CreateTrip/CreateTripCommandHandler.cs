using MediatR;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Entities;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.Trips.Commands.CreateTrip;

public sealed class CreateTripCommandHandler : IRequestHandler<CreateTripCommand, Trip>
{
    private readonly ITripRepository _tripRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;

    public CreateTripCommandHandler(
        ITripRepository tripRepository,
        IUnitOfWork unitOfWork,
        ICurrentUserService currentUserService)
    {
        _tripRepository = tripRepository;
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
    }

    public async Task<Trip> Handle(
        CreateTripCommand request,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUserService.UserId
            ?? throw new UnauthorizedException("User is not authenticated.");

        var trip = Trip.Create(
            currentUserId,
            request.Name,
            request.Description,
            request.StartDate,
            request.EndDate);

        trip.InitializeBudget();
        trip.InitializeDefaultChecklist();

        _tripRepository.Add(trip);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return trip;
    }
}