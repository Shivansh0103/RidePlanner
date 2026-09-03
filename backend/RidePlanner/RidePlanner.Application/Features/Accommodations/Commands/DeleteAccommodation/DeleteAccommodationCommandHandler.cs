using MediatR;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Exceptions;
using RidePlanner.Domain.Services;

namespace RidePlanner.Application.Features.Accommodations.Commands.DeleteAccommodation;

public sealed class DeleteAccommodationCommandHandler : IRequestHandler<DeleteAccommodationCommand>
{
    private readonly ITripRepository _tripRepository;
    private readonly ITripStopRepository _tripStopRepository;
    private readonly IAccommodationRepository _accommodationRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;

    public DeleteAccommodationCommandHandler(
        ITripRepository tripRepository,
        ITripStopRepository tripStopRepository,
        IAccommodationRepository accommodationRepository,
        IUnitOfWork unitOfWork,
        ICurrentUserService currentUserService)
    {
        _tripRepository = tripRepository;
        _tripStopRepository = tripStopRepository;
        _accommodationRepository = accommodationRepository;
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
    }

    public async Task Handle(
        DeleteAccommodationCommand request,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUserService.UserId
            ?? throw new UnauthorizedException("User is not authenticated.");

        var trip = await _tripRepository.GetWithBudgetAsync(
            request.TripId,
            currentUserId,
            cancellationToken);

        if (trip is null)
            throw new NotFoundException("Trip", request.TripId);

        var accommodation = await _accommodationRepository.GetWithDetailsByIdAsync(
            request.Id,
            cancellationToken);

        if (accommodation is null || accommodation.TripId != request.TripId)
            throw new NotFoundException("Accommodation stay", request.Id);

        if (trip.Budget is not null)
        {
            trip.Budget.RemoveAccommodationEstimate(accommodation.Id);
        }

        _tripStopRepository.Remove(accommodation.TripStop);
        _accommodationRepository.Remove(accommodation);

        var remainingStops = (await _tripStopRepository.GetByTripIdAsync(request.TripId, cancellationToken))
            .Where(s => s.Id != accommodation.TripStopId);
        TripStopReconciler.Reconcile(remainingStops);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
