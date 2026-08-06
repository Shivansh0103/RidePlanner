using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RidePlanner.Domain.Entities.Budget;

namespace RidePlanner.Infrastructure.Persistence.Configurations;

public class BudgetEstimateConfiguration : IEntityTypeConfiguration<BudgetEstimate>
{
    public void Configure(EntityTypeBuilder<BudgetEstimate> builder)
    {
        builder.ToTable("BudgetEstimates");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Title)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(x => x.EstimatedAmount)
            .HasPrecision(18, 2);

        builder.Property(x => x.Category)
            .HasConversion<int>();

        builder.HasOne(x => x.TripBudget)
            .WithMany(x => x.Estimates)
            .HasForeignKey(x => x.TripBudgetId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}