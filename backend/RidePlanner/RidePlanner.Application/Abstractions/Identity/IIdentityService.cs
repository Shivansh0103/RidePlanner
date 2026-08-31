namespace RidePlanner.Application.Abstractions.Identity;

public interface IIdentityService
{
    Task<Guid> RegisterUserAsync(
        string email,
        string password,
        CancellationToken cancellationToken = default);
}
