using RidePlanner.Domain.Entities;

namespace RidePlanner.Application.Abstractions.Persistence;

public interface ITripRepository
{
    Task AddAsync(Trip trip, CancellationToken cancellationToken = default);

    Task<Trip?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Trip>> GetAllAsync(CancellationToken cancellationToken = default);

    Task DeleteAsync(Trip trip, CancellationToken cancellationToken = default);

    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}