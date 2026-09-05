using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using RidePlanner.Domain.Exceptions;
using RidePlanner.Infrastructure.Persistence;

namespace RidePlanner.Infrastructure.Identity;

public class RefreshTokenService : IRefreshTokenService
{
    private readonly RidePlannerDbContext _dbContext;

    public RefreshTokenService(RidePlannerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public string GenerateRawToken()
    {
        var bytes = new byte[64];
        RandomNumberGenerator.Fill(bytes);
        return Convert.ToBase64String(bytes);
    }

    public string HashToken(string rawToken)
    {
        var bytes = Encoding.UTF8.GetBytes(rawToken);
        var hashBytes = SHA256.HashData(bytes);
        return Convert.ToHexString(hashBytes).ToLowerInvariant();
    }

    public async Task<(string RawRefreshToken, DateTimeOffset ExpiresAt)> CreateSessionAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var rawToken = GenerateRawToken();
        var tokenHash = HashToken(rawToken);
        var now = DateTimeOffset.UtcNow;
        var expiresAt = now.AddDays(30);

        var session = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            TokenHash = tokenHash,
            FamilyId = Guid.NewGuid(),
            CreatedAt = now,
            ExpiresAt = expiresAt
        };

        _dbContext.RefreshTokens.Add(session);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return (rawToken, expiresAt);
    }

    public async Task<(Guid UserId, string NewRawRefreshToken, DateTimeOffset ExpiresAt)> RotateTokenAsync(
        string rawRefreshToken,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(rawRefreshToken))
        {
            throw new UnauthorizedException("Invalid refresh token.");
        }

        var tokenHash = HashToken(rawRefreshToken);

        var existingToken = await _dbContext.RefreshTokens
            .FirstOrDefaultAsync(r => r.TokenHash == tokenHash, cancellationToken);

        if (existingToken == null)
        {
            throw new UnauthorizedException("Invalid refresh token.");
        }

        if (existingToken.IsRevoked)
        {
            // REUSE DETECTED: A previously consumed token was presented again.
            // Revoke all active tokens in the entire family/session lineage.
            var familyTokens = await _dbContext.RefreshTokens
                .Where(r => r.FamilyId == existingToken.FamilyId && r.RevokedAt == null)
                .ToListAsync(cancellationToken);

            var revokedNow = DateTimeOffset.UtcNow;
            foreach (var token in familyTokens)
            {
                token.RevokedAt = revokedNow;
            }

            await _dbContext.SaveChangesAsync(cancellationToken);
            throw new UnauthorizedException("Invalid refresh token.");
        }

        if (existingToken.IsExpired)
        {
            existingToken.RevokedAt = DateTimeOffset.UtcNow;
            await _dbContext.SaveChangesAsync(cancellationToken);
            throw new UnauthorizedException("Invalid refresh token.");
        }

        // Generate new rotated token
        var newRawToken = GenerateRawToken();
        var newTokenHash = HashToken(newRawToken);
        var now = DateTimeOffset.UtcNow;
        var expiresAt = now.AddDays(30);

        existingToken.RevokedAt = now;
        existingToken.ReplacedByTokenHash = newTokenHash;

        var newSession = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = existingToken.UserId,
            TokenHash = newTokenHash,
            FamilyId = existingToken.FamilyId,
            CreatedAt = now,
            ExpiresAt = expiresAt
        };

        _dbContext.RefreshTokens.Add(newSession);

        try
        {
            await _dbContext.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateConcurrencyException)
        {
            throw new UnauthorizedException("Invalid refresh token.");
        }

        return (existingToken.UserId, newRawToken, expiresAt);
    }

    public async Task RevokeSessionAsync(
        string rawRefreshToken,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(rawRefreshToken))
        {
            return;
        }

        var tokenHash = HashToken(rawRefreshToken);
        var existingToken = await _dbContext.RefreshTokens
            .FirstOrDefaultAsync(r => r.TokenHash == tokenHash, cancellationToken);

        if (existingToken != null && !existingToken.IsRevoked)
        {
            existingToken.RevokedAt = DateTimeOffset.UtcNow;
            await _dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
