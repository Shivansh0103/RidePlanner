using MediatR;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Accommodations.DTOs;
using RidePlanner.Application.Features.Accommodations.Mappings;
using RidePlanner.Domain.Entities;
using RidePlanner.Domain.Enums;
using RidePlanner.Domain.Exceptions;
using RidePlanner.Domain.Services;

namespace RidePlanner.Application.Features.Accommodations.Commands.CreateAccommodation;

public sealed class CreateAccommodationCommandHandler : IRequestHandler<CreateAccommodationCommand, AccommodationResponse>
{
    private readonly ITripRepository _tripRepository;
    private readonly ITripStopRepository _tripStopRepository;
    private readonly IAccommodationRepository _accommodationRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;

    public CreateAccommodationCommandHandler(
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

    public async Task<AccommodationResponse> Handle(
        CreateAccommodationCommand request,
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

        trip.InitializeBudget();

        var existingStops = await _tripStopRepository.GetByTripIdAsync(request.TripId, cancellationToken);
        int initialOrder = request.DisplayOrder > 0 ? request.DisplayOrder : existingStops.Count + 1;

        var tripStop = TripStop.Create(
            request.TripId,
            request.Name,
            request.PlaceId,
            request.FormattedAddress,
            request.Latitude,
            request.Longitude,
            TripStopCategory.Hotel,
            request.CheckInDate,
            request.CheckOutDate,
            request.BookingNotes,
            initialOrder);

        _tripStopRepository.Add(tripStop);

        var allStops = existingStops.Concat(new[] { tripStop });
        TripStopReconciler.Reconcile(allStops);

        var accommodation = Accommodation.Create(
            request.TripId,
            tripStop.Id,
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

        _accommodationRepository.Add(accommodation);

        trip.Budget.SyncAccommodationEstimate(
            accommodation.Id,
            request.Name,
            request.Cost);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return accommodation.ToResponse();
    }
}
