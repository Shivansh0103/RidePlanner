using RidePlanner.Domain.Enums;

namespace RidePlanner.Application.Features.Accommodations.DTOs;

public sealed record CreateAccommodationRequest(
    string Name,
    AccommodationType Type,
    DateOnly CheckInDate,
    DateOnly CheckOutDate,
    TimeOnly? CheckInTime,
    TimeOnly? CheckOutTime,
    string FormattedAddress,
    double? Latitude,
    double? Longitude,
    string? PlaceId,
    string? ConfirmationNumber,
    string? ContactName,
    string? ContactPhone,
    string? Website,
    string? BookingNotes,
    decimal Cost,
    int DisplayOrder);
