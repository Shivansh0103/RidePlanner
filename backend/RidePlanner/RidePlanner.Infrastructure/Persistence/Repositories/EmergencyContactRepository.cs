using Microsoft.EntityFrameworkCore;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Entities;

namespace RidePlanner.Infrastructure.Persistence.Repositories;

public class EmergencyContactRepository : IEmergencyContactRepository
{
    private readonly RidePlannerDbContext _context;

    public EmergencyContactRepository(RidePlannerDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<EmergencyContact>> GetByTripIdAsync(Guid tripId, CancellationToken cancellationToken = default)
    {
        return await _context.EmergencyContacts
            .Where(x => x.TripId == tripId)
            .OrderByDescending(x => x.IsPrimary)
            .ThenBy(x => x.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<EmergencyContact?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.EmergencyContacts
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task AddAsync(EmergencyContact contact, CancellationToken cancellationToken = default)
    {
        await _context.EmergencyContacts.AddAsync(contact, cancellationToken);
    }

    public void Delete(EmergencyContact contact)
    {
        _context.EmergencyContacts.Remove(contact);
    }

    public async Task UnsetPrimaryContactsForTripAsync(Guid tripId, CancellationToken cancellationToken = default)
    {
        var primaryContacts = await _context.EmergencyContacts
            .Where(x => x.TripId == tripId && x.IsPrimary)
            .ToListAsync(cancellationToken);

        foreach (var c in primaryContacts)
        {
            c.SetPrimary(false);
        }
    }
}
