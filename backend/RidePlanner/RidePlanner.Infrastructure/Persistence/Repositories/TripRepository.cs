using Microsoft.EntityFrameworkCore;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Entities;

namespace RidePlanner.Infrastructure.Persistence.Repositories;

public sealed class TripRepository : ITripRepository
{
    private readonly RidePlannerDbContext _dbContext;

    public TripRepository(RidePlannerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public void Add(Trip trip)
    {
        _dbContext.Trips.Add(trip);
    }

    public async Task<Trip?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Trips
            .FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
    }

    public async Task<IReadOnlyList<Trip>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Trips
            .ToListAsync(cancellationToken);
    }

    public Task DeleteAsync(
        Trip trip,
        CancellationToken cancellationToken = default)
    {
        _dbContext.Trips.Remove(trip);

        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}