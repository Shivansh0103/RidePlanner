namespace RidePlanner.Application.Features.Auth.DTOs;

public record RegisterRequest(
    string Email,
    string Password);
