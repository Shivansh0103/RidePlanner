using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Memories.DTOs;
using RidePlanner.Application.Features.Memories.Mappings;

namespace RidePlanner.Application.Features.Memories.Queries.GetTripMemory;

public sealed class GetTripMemoryQueryHandler
{
    private readonly ITripMemoryRepository _memoryRepository;

    public GetTripMemoryQueryHandler(ITripMemoryRepository memoryRepository)
    {
        _memoryRepository = memoryRepository;
    }

    public async Task<TripMemoryDto?> Handle(
        GetTripMemoryQuery query,
        CancellationToken cancellationToken = default)
    {
        var memory = await _memoryRepository.GetByIdAsync(query.MemoryId, cancellationToken);
        if (memory is null || memory.TripId != query.TripId)
        {
            return null;
        }

        return memory.ToDto();
    }
}
