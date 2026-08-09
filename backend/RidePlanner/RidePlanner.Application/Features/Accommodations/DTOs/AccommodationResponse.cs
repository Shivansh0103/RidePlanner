using RidePlanner.Domain.Enums;

namespace RidePlanner.Application.Features.Accommodations.DTOs;

public sealed record AccommodationResponse(
    Guid Id,
    Guid TripId,
    Guid TripStopId,
    string Name,
    AccommodationType Type,
    DateOnly CheckInDate,
    DateOnly CheckOutDate,
    TimeOnly? CheckInTime,
    TimeOnly? CheckOutTime,
    int Nights,
    string FormattedAddress,
    double Latitude,
    double Longitude,
    string? PlaceId,
    string? ConfirmationNumber,
    string? ContactName,
    string? ContactPhone,
    string? Website,
    string? BookingNotes,
    decimal Cost,
    int DisplayOrder);
