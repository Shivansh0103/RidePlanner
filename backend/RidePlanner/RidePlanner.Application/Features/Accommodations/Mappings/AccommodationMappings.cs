using RidePlanner.Application.Features.Accommodations.DTOs;
using RidePlanner.Domain.Entities;

namespace RidePlanner.Application.Features.Accommodations.Mappings;

public static class AccommodationMappings
{
    public static AccommodationResponse ToResponse(this Accommodation accommodation)
    {
        return new AccommodationResponse(
            accommodation.Id,
            accommodation.TripId,
            accommodation.TripStopId,
            accommodation.TripStop.Name,
            accommodation.Type,
            accommodation.CheckInDate,
            accommodation.CheckOutDate,
            accommodation.CheckInTime,
            accommodation.CheckOutTime,
            accommodation.Nights,
            accommodation.TripStop.FormattedAddress,
            accommodation.TripStop.Latitude,
            accommodation.TripStop.Longitude,
            accommodation.TripStop.PlaceId,
            accommodation.ConfirmationNumber,
            accommodation.ContactName,
            accommodation.ContactPhone,
            accommodation.Website,
            accommodation.BookingNotes,
            accommodation.Cost,
            accommodation.TripStop.DisplayOrder);
    }
}
