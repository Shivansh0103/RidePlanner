using RidePlanner.Application.Abstractions.Persistence;

namespace RidePlanner.Infrastructure.Persistence;

public sealed class UnitOfWork : IUnitOfWork
{
    private readonly RidePlannerDbContext _context;

    public UnitOfWork(RidePlannerDbContext context)
    {
        _context = context;
    }

    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return _context.SaveChangesAsync(cancellationToken);
    }
}
