using RidePlanner.Domain.Entities;

namespace RidePlanner.Application.Abstractions.Persistence;

public interface ITripRepository
{
    void Add(Trip trip);

    Task<Trip?> GetByIdAsync(
        Guid id,
        Guid ownerUserId,
        CancellationToken cancellationToken = default);

    Task<Trip?> GetWithBudgetAsync(
        Guid id,
        Guid ownerUserId,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Trip>> GetAllAsync(
        Guid ownerUserId,
        CancellationToken cancellationToken = default);

    Task DeleteAsync(Trip trip, CancellationToken cancellationToken = default);
}