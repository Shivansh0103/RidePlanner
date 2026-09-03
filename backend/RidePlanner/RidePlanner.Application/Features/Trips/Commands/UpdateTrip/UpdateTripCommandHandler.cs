using MediatR;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Entities;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.Trips.Commands.UpdateTrip;

public sealed class UpdateTripCommandHandler : IRequestHandler<UpdateTripCommand, Trip?>
{
    private readonly ITripRepository _tripRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;

    public UpdateTripCommandHandler(
        ITripRepository tripRepository,
        IUnitOfWork unitOfWork,
        ICurrentUserService currentUserService)
    {
        _tripRepository = tripRepository;
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
    }

    public async Task<Trip?> Handle(
        UpdateTripCommand request,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUserService.UserId
            ?? throw new UnauthorizedException("User is not authenticated.");

        var trip = await _tripRepository.GetByIdAsync(request.Id, currentUserId, cancellationToken);

        if (trip == null)
            return null;

        trip.Update(
            request.Name,
            request.Description,
            request.StartDate,
            request.EndDate);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return trip;
    }
}