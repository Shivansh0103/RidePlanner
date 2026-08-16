using RidePlanner.Domain.Entities;

namespace RidePlanner.Application.Abstractions.Persistence;

public interface ITripDocumentRepository
{
    Task<IReadOnlyList<TripDocument>> GetByTripIdAsync(Guid tripId, CancellationToken cancellationToken = default);
    Task<TripDocument?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task AddAsync(TripDocument document, CancellationToken cancellationToken = default);
    void Delete(TripDocument document);
}
