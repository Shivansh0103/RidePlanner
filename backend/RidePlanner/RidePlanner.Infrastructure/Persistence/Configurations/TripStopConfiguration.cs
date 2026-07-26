using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RidePlanner.Domain.Entities;

namespace RidePlanner.Infrastructure.Persistence.Configurations;

public class TripStopConfiguration : IEntityTypeConfiguration<TripStop>
{
    public void Configure(EntityTypeBuilder<TripStop> builder)
    {
        builder.HasKey(s => s.Id);

        builder.Property(s => s.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(s => s.Notes)
            .HasMaxLength(2000);

        builder.Property(s => s.DisplayOrder)
            .IsRequired();

        builder.HasIndex(s => new
        {
            s.TripId,
            s.DisplayOrder
        });
    }
}