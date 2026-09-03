using MediatR;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.Trips.Commands.DeleteTrip;

public sealed class DeleteTripCommandHandler : IRequestHandler<DeleteTripCommand>
{
    private readonly ITripRepository _tripRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;

    public DeleteTripCommandHandler(
        ITripRepository tripRepository,
        IUnitOfWork unitOfWork,
        ICurrentUserService currentUserService)
    {
        _tripRepository = tripRepository;
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
    }

    public async Task Handle(
        DeleteTripCommand request,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUserService.UserId
            ?? throw new UnauthorizedException("User is not authenticated.");

        var trip = await _tripRepository.GetByIdAsync(request.Id, currentUserId, cancellationToken);

        if (trip is null)
            throw new NotFoundException("Trip", request.Id);

        await _tripRepository.DeleteAsync(trip, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
