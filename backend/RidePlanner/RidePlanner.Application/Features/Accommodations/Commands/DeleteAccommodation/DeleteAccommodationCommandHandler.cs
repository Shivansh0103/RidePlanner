using MediatR;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.Accommodations.Commands.DeleteAccommodation;

public sealed class DeleteAccommodationCommandHandler : IRequestHandler<DeleteAccommodationCommand>
{
    private readonly ITripRepository _tripRepository;
    private readonly ITripStopRepository _tripStopRepository;
    private readonly IAccommodationRepository _accommodationRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteAccommodationCommandHandler(
        ITripRepository tripRepository,
        ITripStopRepository tripStopRepository,
        IAccommodationRepository accommodationRepository,
        IUnitOfWork unitOfWork)
    {
        _tripRepository = tripRepository;
        _tripStopRepository = tripStopRepository;
        _accommodationRepository = accommodationRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task Handle(
        DeleteAccommodationCommand request,
        CancellationToken cancellationToken = default)
    {
        var accommodation = await _accommodationRepository.GetWithDetailsByIdAsync(
            request.Id,
            cancellationToken);

        if (accommodation is null || accommodation.TripId != request.TripId)
            throw new DomainException("Accommodation stay not found.");

        var trip = await _tripRepository.GetWithBudgetAsync(
            request.TripId,
            cancellationToken);

        if (trip is not null && trip.Budget is not null)
        {
            trip.Budget.RemoveAccommodationEstimate(accommodation.Id);
        }

        _tripStopRepository.Remove(accommodation.TripStop);
        _accommodationRepository.Remove(accommodation);

        var remainingStops = (await _tripStopRepository.GetByTripIdAsync(request.TripId, cancellationToken))
            .Where(s => s.Id != accommodation.TripStopId);
        RidePlanner.Application.Features.TripStops.Services.TripStopSequenceReconciler.Reconcile(remainingStops);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
