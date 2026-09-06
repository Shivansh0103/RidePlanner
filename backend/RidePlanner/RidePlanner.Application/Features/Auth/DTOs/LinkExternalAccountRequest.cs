namespace RidePlanner.Application.Features.Auth.DTOs;

public sealed record LinkExternalAccountRequest(
    string LinkTicket,
    string Password);
