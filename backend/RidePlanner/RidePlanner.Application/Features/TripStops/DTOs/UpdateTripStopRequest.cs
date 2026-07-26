using System;
using System.Collections.Generic;
using System.Text;

namespace RidePlanner.Application.Features.TripStops.DTOs
{
    public sealed record UpdateTripStopRequest(
    string Name,
    DateOnly ArrivalDate,
    DateOnly DepartureDate,
    string? Notes,
    int DisplayOrder);
}
