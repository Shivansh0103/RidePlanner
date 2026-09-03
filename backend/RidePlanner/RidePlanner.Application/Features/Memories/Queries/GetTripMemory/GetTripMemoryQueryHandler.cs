using MediatR;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Memories.DTOs;
using RidePlanner.Application.Features.Memories.Mappings;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.Memories.Queries.GetTripMemory;

public sealed class GetTripMemoryQueryHandler : IRequestHandler<GetTripMemoryQuery, TripMemoryDto?>
{
    private readonly ITripRepository _tripRepository;
    private readonly ITripMemoryRepository _memoryRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetTripMemoryQueryHandler(
        ITripRepository tripRepository,
        ITripMemoryRepository memoryRepository,
        ICurrentUserService currentUserService)
    {
        _tripRepository = tripRepository;
        _memoryRepository = memoryRepository;
        _currentUserService = currentUserService;
    }

    public async Task<TripMemoryDto?> Handle(
        GetTripMemoryQuery request,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUserService.UserId
            ?? throw new UnauthorizedException("User is not authenticated.");

        var trip = await _tripRepository.GetByIdAsync(request.TripId, currentUserId, cancellationToken);
        if (trip is null)
        {
            return null;
        }

        var memory = await _memoryRepository.GetByIdAsync(request.MemoryId, cancellationToken);
        if (memory is null || memory.TripId != request.TripId)
        {
            return null;
        }

        return memory.ToDto();
    }
}
