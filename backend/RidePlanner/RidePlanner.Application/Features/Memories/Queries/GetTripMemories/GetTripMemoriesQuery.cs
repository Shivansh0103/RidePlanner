using MediatR;
using RidePlanner.Application.Features.Memories.DTOs;

namespace RidePlanner.Application.Features.Memories.Queries.GetTripMemories;

public sealed record GetTripMemoriesQuery(Guid TripId) : IRequest<IReadOnlyList<TripMemoryDto>?>;
