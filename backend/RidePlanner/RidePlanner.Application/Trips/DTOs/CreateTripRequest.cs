namespace RidePlanner.Application.Trips.DTOs;

public record CreateTripRequest(
    string Name,
    string? Description,
    DateOnly StartDate,
    DateOnly EndDate);