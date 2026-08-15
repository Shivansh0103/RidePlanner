namespace RidePlanner.Application.Features.Memories.Commands.DeleteTripMemory;

public sealed record DeleteTripMemoryCommand(
    Guid TripId,
    Guid MemoryId);
