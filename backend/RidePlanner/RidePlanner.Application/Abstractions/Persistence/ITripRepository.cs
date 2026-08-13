using RidePlanner.Domain.Entities;

public interface ITripRepository
{
    void Add(Trip trip);

    Task<Trip?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<Trip?> GetWithBudgetAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Trip>> GetAllAsync(CancellationToken cancellationToken = default);

    Task DeleteAsync(Trip trip, CancellationToken cancellationToken = default);

    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}