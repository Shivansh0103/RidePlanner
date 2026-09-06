namespace RidePlanner.Application.Features.Auth.DTOs;

public sealed record ExternalLinkInfo(
    string MaskedEmail,
    string Provider);
