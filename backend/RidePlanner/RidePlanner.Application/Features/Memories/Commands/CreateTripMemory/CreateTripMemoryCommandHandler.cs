using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Memories.DTOs;
using RidePlanner.Application.Features.Memories.Mappings;
using RidePlanner.Domain.Entities;

namespace RidePlanner.Application.Features.Memories.Commands.CreateTripMemory;

public sealed class CreateTripMemoryCommandHandler
{
    private readonly ITripRepository _tripRepository;
    private readonly ITripMemoryRepository _memoryRepository;

    public CreateTripMemoryCommandHandler(
        ITripRepository tripRepository,
        ITripMemoryRepository memoryRepository)
    {
        _tripRepository = tripRepository;
        _memoryRepository = memoryRepository;
    }

    public async Task<TripMemoryDto?> Handle(
        CreateTripMemoryCommand command,
        CancellationToken cancellationToken = default)
    {
        var trip = await _tripRepository.GetByIdAsync(command.TripId, cancellationToken);
        if (trip is null)
        {
            return null;
        }

        var memory = new TripMemory(
            command.TripId,
            command.Title,
            command.Content,
            command.ImageUrl,
            command.OdometerReadingKm,
            command.MemoryDate);

        await _memoryRepository.AddAsync(memory, cancellationToken);
        await _memoryRepository.SaveChangesAsync(cancellationToken);

        return memory.ToDto();
    }
}
