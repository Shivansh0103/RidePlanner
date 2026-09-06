namespace RidePlanner.Infrastructure.Identity;

public interface IRefreshTokenService
{
    string GenerateRawToken();
    string HashToken(string rawToken);

    Task<(string RawRefreshToken, DateTimeOffset ExpiresAt)> CreateSessionAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task<(Guid UserId, string NewRawRefreshToken, DateTimeOffset ExpiresAt)> RotateTokenAsync(
        string rawRefreshToken,
        CancellationToken cancellationToken = default);

    Task RevokeSessionAsync(
        string rawRefreshToken,
        CancellationToken cancellationToken = default);

    Task RevokeAllUserSessionsAsync(
        Guid userId,
        CancellationToken cancellationToken = default);
}
