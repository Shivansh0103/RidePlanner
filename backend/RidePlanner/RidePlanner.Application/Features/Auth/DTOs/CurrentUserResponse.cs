namespace RidePlanner.Application.Features.Auth.DTOs;

public record CurrentUserResponse(
    Guid? UserId,
    bool IsAuthenticated);
