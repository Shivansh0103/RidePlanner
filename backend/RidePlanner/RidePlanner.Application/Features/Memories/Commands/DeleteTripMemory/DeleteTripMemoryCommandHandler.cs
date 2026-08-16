using MediatR;
using RidePlanner.Application.Abstractions.Persistence;

namespace RidePlanner.Application.Features.Memories.Commands.DeleteTripMemory;

public sealed class DeleteTripMemoryCommandHandler : IRequestHandler<DeleteTripMemoryCommand, bool>
{
    private readonly ITripMemoryRepository _memoryRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteTripMemoryCommandHandler(
        ITripMemoryRepository memoryRepository,
        IUnitOfWork unitOfWork)
    {
        _memoryRepository = memoryRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(
        DeleteTripMemoryCommand request,
        CancellationToken cancellationToken = default)
    {
        var memory = await _memoryRepository.GetByIdAsync(request.MemoryId, cancellationToken);
        if (memory is null || memory.TripId != request.TripId)
        {
            return false;
        }

        _memoryRepository.Delete(memory);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }
}
