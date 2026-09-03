using MediatR;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.TripStops.Commands.ReorderTripStops;

public sealed class ReorderTripStopsCommandHandler : IRequestHandler<ReorderTripStopsCommand>
{
    private readonly ITripRepository _tripRepository;
    private readonly ITripStopRepository _tripStopRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;

    public ReorderTripStopsCommandHandler(
        ITripRepository tripRepository,
        ITripStopRepository tripStopRepository,
        IUnitOfWork unitOfWork,
        ICurrentUserService currentUserService)
    {
        _tripRepository = tripRepository;
        _tripStopRepository = tripStopRepository;
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
    }

    public async Task Handle(
        ReorderTripStopsCommand request,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUserService.UserId
            ?? throw new UnauthorizedException("User is not authenticated.");

        var trip = await _tripRepository.GetByIdAsync(
            request.TripId,
            currentUserId,
            cancellationToken);

        if (trip is null)
            throw new NotFoundException("Trip", request.TripId);

        await _tripStopRepository.ReorderAsync(
            request.TripId,
            request.OrderedStopIds,
            cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
