using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RidePlanner.Domain.Entities;

namespace RidePlanner.Infrastructure.Persistence.Configurations;

public class AccommodationConfiguration : IEntityTypeConfiguration<Accommodation>
{
    public void Configure(EntityTypeBuilder<Accommodation> builder)
    {
        builder.ToTable("Accommodations");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.Type)
            .IsRequired()
            .HasConversion<int>();

        builder.Property(a => a.CheckInDate)
            .IsRequired();

        builder.Property(a => a.CheckOutDate)
            .IsRequired();

        builder.Property(a => a.Cost)
            .HasPrecision(18, 2);

        builder.Property(a => a.ConfirmationNumber)
            .HasMaxLength(100);

        builder.Property(a => a.ContactName)
            .HasMaxLength(100);

        builder.Property(a => a.ContactPhone)
            .HasMaxLength(50);

        builder.Property(a => a.Website)
            .HasMaxLength(500);

        builder.Property(a => a.BookingNotes)
            .HasMaxLength(2000);

        builder.HasOne(a => a.Trip)
            .WithMany(t => t.Accommodations)
            .HasForeignKey(a => a.TripId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(a => a.TripStop)
            .WithOne(s => s.Accommodation)
            .HasForeignKey<Accommodation>(a => a.TripStopId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
