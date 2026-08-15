using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Memories.DTOs;
using RidePlanner.Application.Features.Memories.Mappings;

namespace RidePlanner.Application.Features.Memories.Commands.UpdateTripMemory;

public sealed class UpdateTripMemoryCommandHandler
{
    private readonly ITripMemoryRepository _memoryRepository;

    public UpdateTripMemoryCommandHandler(ITripMemoryRepository memoryRepository)
    {
        _memoryRepository = memoryRepository;
    }

    public async Task<TripMemoryDto?> Handle(
        UpdateTripMemoryCommand command,
        CancellationToken cancellationToken = default)
    {
        var memory = await _memoryRepository.GetByIdAsync(command.MemoryId, cancellationToken);
        if (memory is null || memory.TripId != command.TripId)
        {
            return null;
        }

        memory.Update(
            command.Title,
            command.Content,
            command.ImageUrl,
            command.OdometerReadingKm,
            command.MemoryDate);

        await _memoryRepository.SaveChangesAsync(cancellationToken);

        return memory.ToDto();
    }
}
