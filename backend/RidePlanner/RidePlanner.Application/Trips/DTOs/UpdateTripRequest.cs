namespace RidePlanner.Application.Trips.DTOs;

public record UpdateTripRequest(
    string Name,
    string? Description,
    DateOnly StartDate,
    DateOnly EndDate);