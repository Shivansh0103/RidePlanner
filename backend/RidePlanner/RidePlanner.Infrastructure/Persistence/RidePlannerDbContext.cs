using Microsoft.EntityFrameworkCore;
using RidePlanner.Domain.Entities;

namespace RidePlanner.Infrastructure.Persistence;

public class RidePlannerDbContext : DbContext
{
    public RidePlannerDbContext(DbContextOptions<RidePlannerDbContext> options)
        : base(options)
    {
    }

    public DbSet<Trip> Trips => Set<Trip>();
    public DbSet<TripStop> TripStops => Set<TripStop>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(RidePlannerDbContext).Assembly);

        base.OnModelCreating(modelBuilder);
    }
}