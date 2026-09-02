namespace RidePlanner.Application.Features.Auth.DTOs;

public record AuthResult(
    LoginResponse Response,
    string RefreshToken,
    DateTimeOffset RefreshTokenExpiresAt);
