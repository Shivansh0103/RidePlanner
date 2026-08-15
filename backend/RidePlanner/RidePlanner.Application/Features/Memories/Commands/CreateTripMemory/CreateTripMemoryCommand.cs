namespace RidePlanner.Application.Features.Memories.Commands.CreateTripMemory;

public sealed record CreateTripMemoryCommand(
    Guid TripId,
    string Title,
    string? Content = null,
    string? ImageUrl = null,
    int? OdometerReadingKm = null,
    DateTimeOffset? MemoryDate = null);
