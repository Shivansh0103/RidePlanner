using MediatR;
using RidePlanner.Application.Features.Memories.DTOs;

namespace RidePlanner.Application.Features.Memories.Queries.GetTripMemory;

public sealed record GetTripMemoryQuery(Guid TripId, Guid MemoryId) : IRequest<TripMemoryDto?>;
