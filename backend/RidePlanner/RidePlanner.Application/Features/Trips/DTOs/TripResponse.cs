namespace RidePlanner.Application.Features.Trips.DTOs;

public record TripResponse(
    Guid Id,
    string Name,
    string? Description,
    DateOnly StartDate,
    DateOnly EndDate,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt);