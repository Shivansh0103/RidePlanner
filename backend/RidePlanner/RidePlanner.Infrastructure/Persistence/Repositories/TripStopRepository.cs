using Microsoft.EntityFrameworkCore;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Entities;

namespace RidePlanner.Infrastructure.Persistence.Repositories;

public sealed class TripStopRepository : ITripStopRepository
{
    private readonly RidePlannerDbContext _context;

    public TripStopRepository(RidePlannerDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<TripStop>> GetByTripIdAsync(
        Guid tripId,
        CancellationToken cancellationToken = default)
    {
        return await _context.TripStops
            .Where(stop => stop.TripId == tripId)
            .OrderBy(stop => stop.DisplayOrder)
            .ToListAsync(cancellationToken);
    }

    public async Task<TripStop?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        return await _context.TripStops
            .FirstOrDefaultAsync(
                stop => stop.Id == id,
                cancellationToken);
    }

    public void Add(TripStop tripStop)
    {
        _context.TripStops.Add(tripStop);
    }

    public void Remove(TripStop tripStop)
    {
        _context.TripStops.Remove(tripStop);
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}