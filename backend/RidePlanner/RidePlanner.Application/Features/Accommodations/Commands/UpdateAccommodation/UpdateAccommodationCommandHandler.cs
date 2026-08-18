using MediatR;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Accommodations.DTOs;
using RidePlanner.Application.Features.Accommodations.Mappings;
using RidePlanner.Domain.Enums;
using RidePlanner.Domain.Exceptions;
using RidePlanner.Domain.Services;

namespace RidePlanner.Application.Features.Accommodations.Commands.UpdateAccommodation;

public sealed class UpdateAccommodationCommandHandler : IRequestHandler<UpdateAccommodationCommand, AccommodationResponse>
{
    private readonly ITripRepository _tripRepository;
    private readonly ITripStopRepository _tripStopRepository;
    private readonly IAccommodationRepository _accommodationRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateAccommodationCommandHandler(
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

    public async Task<AccommodationResponse> Handle(
        UpdateAccommodationCommand request,
        CancellationToken cancellationToken = default)
    {
        var accommodation = await _accommodationRepository.GetWithDetailsByIdAsync(
            request.Id,
            cancellationToken);

        if (accommodation is null || accommodation.TripId != request.TripId)
            throw new NotFoundException("Accommodation stay", request.Id);

        var trip = await _tripRepository.GetWithBudgetAsync(
            request.TripId,
            cancellationToken);

        if (trip is null)
            throw new NotFoundException("Trip", request.TripId);

        trip.InitializeBudget();

        int orderToUse = request.DisplayOrder > 0 ? request.DisplayOrder : accommodation.TripStop.DisplayOrder;

        // 1. Update linked TripStop
        accommodation.TripStop.Update(
            request.Name,
            request.PlaceId,
            request.FormattedAddress,
            request.Latitude,
            request.Longitude,
            TripStopCategory.Hotel,
            request.CheckInDate,
            request.CheckOutDate,
            request.BookingNotes,
            orderToUse);

        var allStops = await _tripStopRepository.GetByTripIdAsync(request.TripId, cancellationToken);
        TripStopReconciler.Reconcile(allStops);

        // 2. Update Accommodation
        accommodation.Update(
            request.Type,
            request.CheckInDate,
            request.CheckOutDate,
            request.CheckInTime,
            request.CheckOutTime,
            request.ConfirmationNumber,
            request.ContactName,
            request.ContactPhone,
            request.Website,
            request.BookingNotes,
            request.Cost);

        // 3. Sync linked BudgetEstimate
        trip.Budget.SyncAccommodationEstimate(
            accommodation.Id,
            request.Name,
            request.Cost);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return accommodation.ToResponse();
    }
}
