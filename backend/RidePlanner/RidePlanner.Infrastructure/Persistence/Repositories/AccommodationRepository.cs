using Microsoft.EntityFrameworkCore;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Entities;

namespace RidePlanner.Infrastructure.Persistence.Repositories;

public sealed class AccommodationRepository : IAccommodationRepository
{
    private readonly RidePlannerDbContext _dbContext;

    public AccommodationRepository(RidePlannerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<Accommodation>> GetByTripIdAsync(
        Guid tripId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Accommodations
            .AsNoTracking()
            .Include(a => a.TripStop)
            .Include(a => a.BudgetEstimate)
            .Where(a => a.TripId == tripId)
            .OrderBy(a => a.TripStop.DisplayOrder)
            .ToListAsync(cancellationToken);
    }

    public async Task<Accommodation?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Accommodations
            .FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
    }

    public async Task<Accommodation?> GetWithDetailsByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Accommodations
            .Include(a => a.TripStop)
            .Include(a => a.BudgetEstimate)
            .FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
    }

    public void Add(Accommodation accommodation)
    {
        _dbContext.Accommodations.Add(accommodation);
    }

    public void Remove(Accommodation accommodation)
    {
        _dbContext.Accommodations.Remove(accommodation);
    }
}
