using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.Accommodations.Commands.DeleteAccommodation;

public sealed class DeleteAccommodationCommandHandler
{
    private readonly ITripRepository _tripRepository;
    private readonly ITripStopRepository _tripStopRepository;
    private readonly IAccommodationRepository _accommodationRepository;

    public DeleteAccommodationCommandHandler(
        ITripRepository tripRepository,
        ITripStopRepository tripStopRepository,
        IAccommodationRepository accommodationRepository)
    {
        _tripRepository = tripRepository;
        _tripStopRepository = tripStopRepository;
        _accommodationRepository = accommodationRepository;
    }

    public async Task Handle(
        DeleteAccommodationCommand command,
        CancellationToken cancellationToken)
    {
        var accommodation = await _accommodationRepository.GetWithDetailsByIdAsync(
            command.Id,
            cancellationToken);

        if (accommodation is null || accommodation.TripId != command.TripId)
            throw new DomainException("Accommodation stay not found.");

        var trip = await _tripRepository.GetWithBudgetAsync(
            command.TripId,
            cancellationToken);

        if (trip is not null && trip.Budget is not null)
        {
            trip.Budget.RemoveAccommodationEstimate(accommodation.Id);
        }

        _tripStopRepository.Remove(accommodation.TripStop);
        _accommodationRepository.Remove(accommodation);

        await _tripRepository.SaveChangesAsync(cancellationToken);
    }
}
