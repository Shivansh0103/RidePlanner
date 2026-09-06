using RidePlanner.Application.Features.Auth.DTOs;

namespace RidePlanner.Application.Abstractions.Identity;

public interface IIdentityService
{
    Task<Guid> RegisterUserAsync(
        string email,
        string password,
        CancellationToken cancellationToken = default);

    Task<AuthResult> LoginAsync(
        string email,
        string password,
        CancellationToken cancellationToken = default);

    Task<AuthResult> RefreshTokenAsync(
        string rawRefreshToken,
        CancellationToken cancellationToken = default);

    Task LogoutAsync(
        string? rawRefreshToken,
        CancellationToken cancellationToken = default);

    Task ForgotPasswordAsync(
        string email,
        CancellationToken cancellationToken = default);

    Task ResetPasswordAsync(
        Guid userId,
        string token,
        string newPassword,
        CancellationToken cancellationToken = default);
}
