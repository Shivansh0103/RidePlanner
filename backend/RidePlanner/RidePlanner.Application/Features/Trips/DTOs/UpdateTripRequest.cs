namespace RidePlanner.Application.Features.Trips.DTOs;

public record UpdateTripRequest(
    string Name,
    string? Description,
    DateOnly StartDate,
    DateOnly EndDate);