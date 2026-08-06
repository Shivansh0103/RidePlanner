using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RidePlanner.Domain.Entities.Budget;

namespace RidePlanner.Infrastructure.Persistence.Configurations;

public class TripBudgetConfiguration : IEntityTypeConfiguration<TripBudget>
{
    public void Configure(EntityTypeBuilder<TripBudget> builder)
    {
        builder.ToTable("TripBudgets");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.TargetBudget)
            .HasPrecision(18, 2);

        builder.HasOne(x => x.Trip)
            .WithOne(x => x.Budget)
            .HasForeignKey<TripBudget>(x => x.TripId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Navigation(x => x.Estimates)
            .UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}