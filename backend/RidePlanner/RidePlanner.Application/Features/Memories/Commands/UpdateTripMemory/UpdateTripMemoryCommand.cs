using MediatR;
using RidePlanner.Application.Features.Memories.DTOs;

namespace RidePlanner.Application.Features.Memories.Commands.UpdateTripMemory;

public sealed record UpdateTripMemoryCommand(
    Guid TripId,
    Guid MemoryId,
    string Title,
    string? Content = null,
    string? ImageUrl = null,
    int? OdometerReadingKm = null,
    DateTimeOffset? MemoryDate = null) : IRequest<TripMemoryDto?>;
