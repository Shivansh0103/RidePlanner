namespace RidePlanner.Application.Features.Auth.DTOs;

public record LoginResponse(
    string AccessToken,
    string TokenType,
    int ExpiresIn,
    Guid UserId,
    string Email);
