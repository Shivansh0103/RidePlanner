using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RidePlanner.Domain.Entities;
using RidePlanner.Infrastructure.Identity;

namespace RidePlanner.Infrastructure.Persistence.Configurations;

public class UserProfileConfiguration : IEntityTypeConfiguration<UserProfile>
{
    public void Configure(EntityTypeBuilder<UserProfile> builder)
    {
        builder.ToTable("UserProfiles");

        builder.HasKey(p => p.UserId);

        builder.Property(p => p.UserId)
            .ValueGeneratedNever();

        builder.Property(p => p.PreferredCurrencyCode)
            .IsRequired()
            .HasMaxLength(3);

        builder.Property(p => p.DistanceUnit)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(p => p.DefaultVehicleName)
            .HasMaxLength(100)
            .IsRequired(false);

        builder.Property(p => p.DefaultTankCapacityLitres)
            .HasPrecision(6, 2)
            .IsRequired(false);

        builder.Property(p => p.DefaultFuelEfficiencyKmPerLitre)
            .HasPrecision(6, 2)
            .IsRequired(false);

        builder.Property(p => p.CreatedAt)
            .IsRequired();

        builder.Property(p => p.UpdatedAt)
            .IsRequired();

        builder.HasOne<ApplicationUser>()
            .WithOne()
            .HasForeignKey<UserProfile>(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
