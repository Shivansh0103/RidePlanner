namespace RidePlanner.Application.Features.Auth.DTOs;

public sealed record ExternalLoginModel(
    string Provider,
    string ProviderKey,
    string Email,
    string? DisplayName);
