using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RidePlanner.Domain.Entities;

namespace RidePlanner.Infrastructure.Persistence.Configurations;

public class TripConfiguration : IEntityTypeConfiguration<Trip>
{
    public void Configure(EntityTypeBuilder<Trip> builder)
    {
        builder.HasKey(t => t.Id);

        builder.Property(t => t.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(t => t.Description)
            .HasMaxLength(1000);

        builder.HasMany(t => t.Stops)
            .WithOne(s => s.Trip)
            .HasForeignKey(s => s.TripId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}