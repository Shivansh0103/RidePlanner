using MediatR;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Memories.DTOs;
using RidePlanner.Application.Features.Memories.Mappings;

namespace RidePlanner.Application.Features.Memories.Commands.UpdateTripMemory;

public sealed class UpdateTripMemoryCommandHandler : IRequestHandler<UpdateTripMemoryCommand, TripMemoryDto?>
{
    private readonly ITripMemoryRepository _memoryRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateTripMemoryCommandHandler(
        ITripMemoryRepository memoryRepository,
        IUnitOfWork unitOfWork)
    {
        _memoryRepository = memoryRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<TripMemoryDto?> Handle(
        UpdateTripMemoryCommand request,
        CancellationToken cancellationToken = default)
    {
        var memory = await _memoryRepository.GetByIdAsync(request.MemoryId, cancellationToken);
        if (memory is null || memory.TripId != request.TripId)
        {
            return null;
        }

        memory.Update(
            request.Title,
            request.Content,
            request.ImageUrl,
            request.OdometerReadingKm,
            request.MemoryDate);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return memory.ToDto();
    }
}
