using Microsoft.EntityFrameworkCore;
using RidePlanner.Domain.Common;
using RidePlanner.Domain.Entities;
using RidePlanner.Domain.Entities.Budget;
using RidePlanner.Domain.Entities.Checklist;

namespace RidePlanner.Infrastructure.Persistence;

public class RidePlannerDbContext : DbContext
{
    public RidePlannerDbContext(DbContextOptions<RidePlannerDbContext> options)
        : base(options)
    {
    }

    public DbSet<Trip> Trips => Set<Trip>();
    public DbSet<TripStop> TripStops => Set<TripStop>();
    public DbSet<Accommodation> Accommodations => Set<Accommodation>();
    public DbSet<TripBudget> TripBudgets => Set<TripBudget>();
    public DbSet<BudgetEstimate> BudgetEstimates => Set<BudgetEstimate>();
    public DbSet<Expense> Expenses => Set<Expense>();
    public DbSet<ChecklistCategory> ChecklistCategories => Set<ChecklistCategory>();
    public DbSet<ChecklistItem> ChecklistItems => Set<ChecklistItem>();
    public DbSet<TripDocument> TripDocuments => Set<TripDocument>();
    public DbSet<EmergencyContact> EmergencyContacts => Set<EmergencyContact>();
    public DbSet<TripMemory> TripMemories => Set<TripMemory>();

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateAuditableEntities();
        return base.SaveChangesAsync(cancellationToken);
    }

    public override int SaveChanges()
    {
        UpdateAuditableEntities();
        return base.SaveChanges();
    }

    private void UpdateAuditableEntities()
    {
        var now = DateTimeOffset.UtcNow;

        foreach (var entry in ChangeTracker.Entries<IAuditableEntity>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Property(nameof(IAuditableEntity.CreatedAt)).CurrentValue = now;
                entry.Property(nameof(IAuditableEntity.UpdatedAt)).CurrentValue = now;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Property(nameof(IAuditableEntity.UpdatedAt)).CurrentValue = now;
            }
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(RidePlannerDbContext).Assembly);

        base.OnModelCreating(modelBuilder);
    }
}