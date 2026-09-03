using MediatR;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Memories.DTOs;
using RidePlanner.Application.Features.Memories.Mappings;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.Memories.Queries.GetTripMemories;

public sealed class GetTripMemoriesQueryHandler : IRequestHandler<GetTripMemoriesQuery, IReadOnlyList<TripMemoryDto>?>
{
    private readonly ITripMemoryRepository _memoryRepository;
    private readonly ITripRepository _tripRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetTripMemoriesQueryHandler(
        ITripMemoryRepository memoryRepository,
        ITripRepository tripRepository,
        ICurrentUserService currentUserService)
    {
        _memoryRepository = memoryRepository;
        _tripRepository = tripRepository;
        _currentUserService = currentUserService;
    }

    public async Task<IReadOnlyList<TripMemoryDto>?> Handle(
        GetTripMemoriesQuery request,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUserService.UserId
            ?? throw new UnauthorizedException("User is not authenticated.");

        var trip = await _tripRepository.GetByIdAsync(request.TripId, currentUserId, cancellationToken);
        if (trip is null)
        {
            return null;
        }

        var memories = await _memoryRepository.GetByTripIdAsync(request.TripId, cancellationToken);
        return memories.Select(m => m.ToDto()).ToList();
    }
}
