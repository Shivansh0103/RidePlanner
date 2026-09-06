namespace RidePlanner.Application.Features.Auth.DTOs;

public sealed record ResetPasswordRequest(
    Guid UserId,
    string Token,
    string NewPassword);
