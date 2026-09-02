using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RidePlanner.Infrastructure.Identity;

namespace RidePlanner.Infrastructure.Persistence.Configurations;

public class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
{
    public void Configure(EntityTypeBuilder<RefreshToken> builder)
    {
        builder.ToTable("RefreshTokens");

        builder.HasKey(r => r.Id);

        builder.Property(r => r.TokenHash)
            .IsRequired()
            .HasMaxLength(128);

        builder.HasIndex(r => r.TokenHash)
            .IsUnique();

        builder.HasIndex(r => r.UserId);

        builder.HasIndex(r => r.FamilyId);

        builder.Property(r => r.CreatedAt)
            .IsRequired();

        builder.Property(r => r.ExpiresAt)
            .IsRequired();

        builder.Property(r => r.RevokedAt)
            .IsRequired(false)
            .IsConcurrencyToken();

        builder.Property(r => r.ReplacedByTokenHash)
            .HasMaxLength(128)
            .IsRequired(false);

        builder.HasOne(r => r.User)
            .WithMany()
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
