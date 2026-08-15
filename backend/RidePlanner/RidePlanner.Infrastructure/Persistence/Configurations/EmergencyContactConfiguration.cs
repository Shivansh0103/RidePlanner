using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RidePlanner.Domain.Entities;

namespace RidePlanner.Infrastructure.Persistence.Configurations;

public class EmergencyContactConfiguration : IEntityTypeConfiguration<EmergencyContact>
{
    public void Configure(EntityTypeBuilder<EmergencyContact> builder)
    {
        builder.ToTable("EmergencyContacts");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(x => x.Relationship)
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(x => x.Phone)
            .HasMaxLength(30)
            .IsRequired();

        builder.Property(x => x.AlternatePhone)
            .HasMaxLength(30);

        builder.Property(x => x.Email)
            .HasMaxLength(100);

        builder.Property(x => x.IsPrimary)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(x => x.CreatedAt)
            .IsRequired();

        builder.Property(x => x.UpdatedAt)
            .IsRequired();

        builder.HasOne(x => x.Trip)
            .WithMany(x => x.EmergencyContacts)
            .HasForeignKey(x => x.TripId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => new { x.TripId, x.Name });
    }
}
