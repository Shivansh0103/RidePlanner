namespace RidePlanner.Application.Features.Trips.DTOs;

public record CreateTripRequest(
    string Name,
    string? Description,
    DateOnly StartDate,
    DateOnly EndDate);