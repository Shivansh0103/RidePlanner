using RidePlanner.Domain.Entities;

namespace RidePlanner.Application.Abstractions.Persistence;

public interface IUserProfileRepository
{
    void Add(UserProfile profile);

    Task<UserProfile?> GetByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default);
}
