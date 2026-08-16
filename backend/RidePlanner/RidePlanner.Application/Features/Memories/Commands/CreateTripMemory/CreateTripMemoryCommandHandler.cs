using MediatR;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Memories.DTOs;
using RidePlanner.Application.Features.Memories.Mappings;
using RidePlanner.Domain.Entities;

namespace RidePlanner.Application.Features.Memories.Commands.CreateTripMemory;

public sealed class CreateTripMemoryCommandHandler : IRequestHandler<CreateTripMemoryCommand, TripMemoryDto?>
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
        CreateTripMemoryCommand request,
        CancellationToken cancellationToken = default)
    {
        var trip = await _tripRepository.GetByIdAsync(request.TripId, cancellationToken);
        if (trip is null)
        {
            return null;
        }

        var memory = new TripMemory(
            request.TripId,
            request.Title,
            request.Content,
            request.ImageUrl,
            request.OdometerReadingKm,
            request.MemoryDate);

        await _memoryRepository.AddAsync(memory, cancellationToken);
        await _memoryRepository.SaveChangesAsync(cancellationToken);

        return memory.ToDto();
    }
}
