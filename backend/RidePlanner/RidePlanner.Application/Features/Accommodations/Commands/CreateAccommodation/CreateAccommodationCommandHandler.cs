using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Accommodations.DTOs;
using RidePlanner.Application.Features.Accommodations.Mappings;
using RidePlanner.Domain.Entities;
using RidePlanner.Domain.Enums;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.Accommodations.Commands.CreateAccommodation;

public sealed class CreateAccommodationCommandHandler
{
    private readonly ITripRepository _tripRepository;
    private readonly ITripStopRepository _tripStopRepository;
    private readonly IAccommodationRepository _accommodationRepository;

    public CreateAccommodationCommandHandler(
        ITripRepository tripRepository,
        ITripStopRepository tripStopRepository,
        IAccommodationRepository accommodationRepository)
    {
        _tripRepository = tripRepository;
        _tripStopRepository = tripStopRepository;
        _accommodationRepository = accommodationRepository;
    }

    public async Task<AccommodationResponse> Handle(
        CreateAccommodationCommand command,
        CancellationToken cancellationToken)
    {
        var trip = await _tripRepository.GetWithBudgetAsync(
            command.TripId,
            cancellationToken);

        if (trip is null)
            throw new DomainException("Trip not found.");

        trip.InitializeBudget();

        var tripStop = TripStop.Create(
            command.TripId,
            command.Name,
            command.PlaceId,
            command.FormattedAddress,
            command.Latitude,
            command.Longitude,
            TripStopCategory.Hotel,
            command.CheckInDate,
            command.CheckOutDate,
            command.BookingNotes,
            command.DisplayOrder);

        _tripStopRepository.Add(tripStop);

        var accommodation = Accommodation.Create(
            command.TripId,
            tripStop.Id,
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

        _accommodationRepository.Add(accommodation);

        trip.Budget.SyncAccommodationEstimate(
            accommodation.Id,
            command.Name,
            command.Cost);

        await _tripRepository.SaveChangesAsync(cancellationToken);

        return accommodation.ToResponse();
    }
}
