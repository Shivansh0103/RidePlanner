using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RidePlanner.Domain.Entities.Checklist;

namespace RidePlanner.Infrastructure.Persistence.Configurations;

public class ChecklistCategoryConfiguration : IEntityTypeConfiguration<ChecklistCategory>
{
    public void Configure(EntityTypeBuilder<ChecklistCategory> builder)
    {
        builder.ToTable("ChecklistCategories");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(x => x.DisplayOrder)
            .IsRequired();

        builder.HasOne(x => x.Trip)
            .WithMany(x => x.ChecklistCategories)
            .HasForeignKey(x => x.TripId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Navigation(x => x.Items)
            .UsePropertyAccessMode(PropertyAccessMode.Field);

        builder.HasIndex(x => new { x.TripId, x.DisplayOrder });
    }
}
