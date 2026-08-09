using RidePlanner.Domain.Entities;

namespace RidePlanner.Application.Abstractions.Persistence;

public interface IAccommodationRepository
{
    Task<IReadOnlyList<Accommodation>> GetByTripIdAsync(
        Guid tripId,
        CancellationToken cancellationToken = default);

    Task<Accommodation?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task<Accommodation?> GetWithDetailsByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    void Add(Accommodation accommodation);

    void Remove(Accommodation accommodation);

    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
