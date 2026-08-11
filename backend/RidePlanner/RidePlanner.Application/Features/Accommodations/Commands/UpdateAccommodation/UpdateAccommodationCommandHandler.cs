using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Accommodations.DTOs;
using RidePlanner.Application.Features.Accommodations.Mappings;
using RidePlanner.Application.Features.TripStops.Services;
using RidePlanner.Domain.Enums;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.Accommodations.Commands.UpdateAccommodation;

public sealed class UpdateAccommodationCommandHandler
{
    private readonly ITripRepository _tripRepository;
    private readonly ITripStopRepository _tripStopRepository;
    private readonly IAccommodationRepository _accommodationRepository;

    public UpdateAccommodationCommandHandler(
        ITripRepository tripRepository,
        ITripStopRepository tripStopRepository,
        IAccommodationRepository accommodationRepository)
    {
        _tripRepository = tripRepository;
        _tripStopRepository = tripStopRepository;
        _accommodationRepository = accommodationRepository;
    }

    public async Task<AccommodationResponse> Handle(
        UpdateAccommodationCommand command,
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

        if (trip is null)
            throw new DomainException("Trip not found.");

        trip.InitializeBudget();

        int orderToUse = command.DisplayOrder > 0 ? command.DisplayOrder : accommodation.TripStop.DisplayOrder;

        // 1. Update linked TripStop
        accommodation.TripStop.Update(
            command.Name,
            command.PlaceId,
            command.FormattedAddress,
            command.Latitude,
            command.Longitude,
            TripStopCategory.Hotel,
            command.CheckInDate,
            command.CheckOutDate,
            command.BookingNotes,
            orderToUse);

        var allStops = await _tripStopRepository.GetByTripIdAsync(command.TripId, cancellationToken);
        TripStopSequenceReconciler.Reconcile(allStops);

        // 2. Update Accommodation
        accommodation.Update(
            command.Type,
            command.CheckInDate,
            command.CheckOutDate,
            command.CheckInTime,
            command.CheckOutTime,
            command.ConfirmationNumber,
            command.ContactName,
            command.ContactPhone,
            command.Website,
            command.BookingNotes,
            command.Cost);

        // 3. Sync linked BudgetEstimate
        trip.Budget.SyncAccommodationEstimate(
            accommodation.Id,
            command.Name,
            command.Cost);

        await _tripRepository.SaveChangesAsync(cancellationToken);

        return accommodation.ToResponse();
    }
}
