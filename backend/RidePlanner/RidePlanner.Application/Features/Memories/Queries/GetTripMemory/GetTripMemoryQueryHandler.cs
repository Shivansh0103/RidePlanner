using MediatR;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Memories.DTOs;
using RidePlanner.Application.Features.Memories.Mappings;

namespace RidePlanner.Application.Features.Memories.Queries.GetTripMemory;

public sealed class GetTripMemoryQueryHandler : IRequestHandler<GetTripMemoryQuery, TripMemoryDto?>
{
    private readonly ITripMemoryRepository _memoryRepository;

    public GetTripMemoryQueryHandler(ITripMemoryRepository memoryRepository)
    {
        _memoryRepository = memoryRepository;
    }

    public async Task<TripMemoryDto?> Handle(
        GetTripMemoryQuery request,
        CancellationToken cancellationToken = default)
    {
        var memory = await _memoryRepository.GetByIdAsync(request.MemoryId, cancellationToken);
        if (memory is null || memory.TripId != request.TripId)
        {
            return null;
        }

        return memory.ToDto();
    }
}
