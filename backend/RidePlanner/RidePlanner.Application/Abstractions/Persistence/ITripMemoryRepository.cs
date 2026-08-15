using RidePlanner.Domain.Entities;

namespace RidePlanner.Application.Abstractions.Persistence;

public interface ITripMemoryRepository
{
    Task<IReadOnlyList<TripMemory>> GetByTripIdAsync(Guid tripId, CancellationToken cancellationToken = default);
    Task<TripMemory?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task AddAsync(TripMemory memory, CancellationToken cancellationToken = default);
    void Delete(TripMemory memory);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
