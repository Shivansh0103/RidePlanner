using Microsoft.EntityFrameworkCore;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Entities;

namespace RidePlanner.Infrastructure.Persistence.Repositories;

public class TripMemoryRepository : ITripMemoryRepository
{
    private readonly RidePlannerDbContext _context;

    public TripMemoryRepository(RidePlannerDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<TripMemory>> GetByTripIdAsync(Guid tripId, CancellationToken cancellationToken = default)
    {
        return await _context.TripMemories
            .Where(x => x.TripId == tripId)
            .OrderByDescending(x => x.MemoryDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<TripMemory?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.TripMemories
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task AddAsync(TripMemory memory, CancellationToken cancellationToken = default)
    {
        await _context.TripMemories.AddAsync(memory, cancellationToken);
    }

    public void Delete(TripMemory memory)
    {
        _context.TripMemories.Remove(memory);
    }
}
