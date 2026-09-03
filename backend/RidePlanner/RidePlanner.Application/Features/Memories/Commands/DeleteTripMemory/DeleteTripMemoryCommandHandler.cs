using MediatR;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.Memories.Commands.DeleteTripMemory;

public sealed class DeleteTripMemoryCommandHandler : IRequestHandler<DeleteTripMemoryCommand, bool>
{
    private readonly ITripRepository _tripRepository;
    private readonly ITripMemoryRepository _memoryRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;

    public DeleteTripMemoryCommandHandler(
        ITripRepository tripRepository,
        ITripMemoryRepository memoryRepository,
        IUnitOfWork unitOfWork,
        ICurrentUserService currentUserService)
    {
        _tripRepository = tripRepository;
        _memoryRepository = memoryRepository;
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(
        DeleteTripMemoryCommand request,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUserService.UserId
            ?? throw new UnauthorizedException("User is not authenticated.");

        var trip = await _tripRepository.GetByIdAsync(request.TripId, currentUserId, cancellationToken);
        if (trip is null)
        {
            return false;
        }

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
