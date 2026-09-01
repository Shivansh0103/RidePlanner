using RidePlanner.Application.Features.Auth.DTOs;

namespace RidePlanner.Application.Abstractions.Identity;

public interface IIdentityService
{
    Task<Guid> RegisterUserAsync(
        string email,
        string password,
        CancellationToken cancellationToken = default);

    Task<LoginResponse> LoginAsync(
        string email,
        string password,
        CancellationToken cancellationToken = default);
}
