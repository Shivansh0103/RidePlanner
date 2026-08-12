using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RidePlanner.Domain.Entities.Budget;

namespace RidePlanner.Infrastructure.Persistence.Configurations;

public class ExpenseConfiguration : IEntityTypeConfiguration<Expense>
{
    public void Configure(EntityTypeBuilder<Expense> builder)
    {
        builder.ToTable("Expenses");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Title)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(x => x.Amount)
            .HasPrecision(18, 2)
            .IsRequired();

        builder.Property(x => x.Category)
            .HasConversion<int>()
            .IsRequired();

        builder.Property(x => x.PaymentMethod)
            .HasConversion<int>();

        builder.Property(x => x.Notes)
            .HasMaxLength(1000);

        builder.Property(x => x.ExpenseDate)
            .IsRequired();

        builder.Property(x => x.CreatedAt)
            .IsRequired();

        builder.HasOne(x => x.TripBudget)
            .WithMany(x => x.Expenses)
            .HasForeignKey(x => x.TripBudgetId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Accommodation)
            .WithMany()
            .HasForeignKey(x => x.AccommodationId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(x => x.TripStop)
            .WithMany()
            .HasForeignKey(x => x.TripStopId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasIndex(x => x.TripBudgetId);
        builder.HasIndex(x => new { x.TripBudgetId, x.Category });
        builder.HasIndex(x => x.ExpenseDate);
    }
}
