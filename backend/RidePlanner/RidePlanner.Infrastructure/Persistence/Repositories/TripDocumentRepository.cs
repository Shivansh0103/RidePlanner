using Microsoft.EntityFrameworkCore;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Entities;

namespace RidePlanner.Infrastructure.Persistence.Repositories;

public class TripDocumentRepository : ITripDocumentRepository
{
    private readonly RidePlannerDbContext _context;

    public TripDocumentRepository(RidePlannerDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<TripDocument>> GetByTripIdAsync(Guid tripId, CancellationToken cancellationToken = default)
    {
        return await _context.TripDocuments
            .Where(x => x.TripId == tripId)
            .OrderBy(x => x.Title)
            .ToListAsync(cancellationToken);
    }

    public async Task<TripDocument?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.TripDocuments
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task AddAsync(TripDocument document, CancellationToken cancellationToken = default)
    {
        await _context.TripDocuments.AddAsync(document, cancellationToken);
    }

    public void Delete(TripDocument document)
    {
        _context.TripDocuments.Remove(document);
    }
}
