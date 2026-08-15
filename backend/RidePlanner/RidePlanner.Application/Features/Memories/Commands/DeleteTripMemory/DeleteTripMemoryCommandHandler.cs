using RidePlanner.Application.Abstractions.Persistence;

namespace RidePlanner.Application.Features.Memories.Commands.DeleteTripMemory;

public sealed class DeleteTripMemoryCommandHandler
{
    private readonly ITripMemoryRepository _memoryRepository;

    public DeleteTripMemoryCommandHandler(ITripMemoryRepository memoryRepository)
    {
        _memoryRepository = memoryRepository;
    }

    public async Task<bool> Handle(
        DeleteTripMemoryCommand command,
        CancellationToken cancellationToken = default)
    {
        var memory = await _memoryRepository.GetByIdAsync(command.MemoryId, cancellationToken);
        if (memory is null || memory.TripId != command.TripId)
        {
            return false;
        }

        _memoryRepository.Delete(memory);
        await _memoryRepository.SaveChangesAsync(cancellationToken);

        return true;
    }
}
