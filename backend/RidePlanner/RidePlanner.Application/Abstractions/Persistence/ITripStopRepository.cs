using RidePlanner.Domain.Entities;

namespace RidePlanner.Application.Abstractions.Persistence;

public interface ITripStopRepository
{
    Task<IReadOnlyList<TripStop>> GetByTripIdAsync(
        Guid tripId,
        CancellationToken cancellationToken = default);

    Task<TripStop?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    void Add(TripStop tripStop);

    void Remove(TripStop tripStop);

    Task SaveChangesAsync(
        CancellationToken cancellationToken = default);
}