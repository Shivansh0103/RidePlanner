using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RidePlanner.Domain.Entities;

namespace RidePlanner.Infrastructure.Persistence.Configurations;

public class TripMemoryConfiguration : IEntityTypeConfiguration<TripMemory>
{
    public void Configure(EntityTypeBuilder<TripMemory> builder)
    {
        builder.ToTable("TripMemories");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Title)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(x => x.Content)
            .HasMaxLength(2000);

        builder.Property(x => x.ImageUrl)
            .HasMaxLength(500);

        builder.Property(x => x.OdometerReadingKm);

        builder.Property(x => x.MemoryDate)
            .IsRequired();

        builder.Property(x => x.CreatedAt)
            .IsRequired();

        builder.Property(x => x.UpdatedAt)
            .IsRequired();

        builder.HasOne(x => x.Trip)
            .WithMany(x => x.Memories)
            .HasForeignKey(x => x.TripId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => new { x.TripId, x.MemoryDate });
    }
}
