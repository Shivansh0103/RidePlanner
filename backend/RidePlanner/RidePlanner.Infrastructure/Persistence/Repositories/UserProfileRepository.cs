using Microsoft.EntityFrameworkCore;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Entities;

namespace RidePlanner.Infrastructure.Persistence.Repositories;

public sealed class UserProfileRepository : IUserProfileRepository
{
    private readonly RidePlannerDbContext _dbContext;

    public UserProfileRepository(RidePlannerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public void Add(UserProfile profile)
    {
        _dbContext.UserProfiles.Add(profile);
    }

    public async Task<UserProfile?> GetByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.UserProfiles
            .FirstOrDefaultAsync(p => p.UserId == userId, cancellationToken);
    }
}
