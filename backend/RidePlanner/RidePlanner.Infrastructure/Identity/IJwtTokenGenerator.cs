namespace RidePlanner.Infrastructure.Identity;

public interface IJwtTokenGenerator
{
    (string Token, int ExpiresIn) GenerateToken(Guid userId, string email, string? displayName = null);
}
