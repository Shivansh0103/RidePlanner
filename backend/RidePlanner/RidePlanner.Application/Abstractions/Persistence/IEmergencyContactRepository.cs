using RidePlanner.Domain.Entities;

namespace RidePlanner.Application.Abstractions.Persistence;

public interface IEmergencyContactRepository
{
    Task<IReadOnlyList<EmergencyContact>> GetByTripIdAsync(Guid tripId, CancellationToken cancellationToken = default);
    Task<EmergencyContact?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task AddAsync(EmergencyContact contact, CancellationToken cancellationToken = default);
    void Delete(EmergencyContact contact);
    Task UnsetPrimaryContactsForTripAsync(Guid tripId, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
