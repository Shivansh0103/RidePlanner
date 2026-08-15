using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Memories.DTOs;
using RidePlanner.Application.Features.Memories.Mappings;

namespace RidePlanner.Application.Features.Memories.Queries.GetTripMemories;

public sealed class GetTripMemoriesQueryHandler
{
    private readonly ITripMemoryRepository _memoryRepository;
    private readonly ITripRepository _tripRepository;

    public GetTripMemoriesQueryHandler(
        ITripMemoryRepository memoryRepository,
        ITripRepository tripRepository)
    {
        _memoryRepository = memoryRepository;
        _tripRepository = tripRepository;
    }

    public async Task<IReadOnlyList<TripMemoryDto>?> Handle(
        GetTripMemoriesQuery query,
        CancellationToken cancellationToken = default)
    {
        var trip = await _tripRepository.GetByIdAsync(query.TripId, cancellationToken);
        if (trip is null)
        {
            return null;
        }

        var memories = await _memoryRepository.GetByTripIdAsync(query.TripId, cancellationToken);
        return memories.Select(m => m.ToDto()).ToList();
    }
}
