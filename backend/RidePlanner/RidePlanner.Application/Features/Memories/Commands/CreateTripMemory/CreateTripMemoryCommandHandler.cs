using MediatR;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Memories.DTOs;
using RidePlanner.Application.Features.Memories.Mappings;
using RidePlanner.Domain.Entities;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.Memories.Commands.CreateTripMemory;

public sealed class CreateTripMemoryCommandHandler : IRequestHandler<CreateTripMemoryCommand, TripMemoryDto?>
{
    private readonly ITripRepository _tripRepository;
    private readonly ITripMemoryRepository _memoryRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;

    public CreateTripMemoryCommandHandler(
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

    public async Task<TripMemoryDto?> Handle(
        CreateTripMemoryCommand request,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUserService.UserId
            ?? throw new UnauthorizedException("User is not authenticated.");

        var trip = await _tripRepository.GetByIdAsync(request.TripId, currentUserId, cancellationToken);
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
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return memory.ToDto();
    }
}
