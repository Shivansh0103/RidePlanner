using Microsoft.EntityFrameworkCore;
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



    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(RidePlannerDbContext).Assembly);

        base.OnModelCreating(modelBuilder);
    }
}