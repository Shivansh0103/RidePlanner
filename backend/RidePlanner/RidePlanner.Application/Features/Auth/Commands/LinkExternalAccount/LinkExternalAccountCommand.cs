using MediatR;
using RidePlanner.Application.Features.Auth.DTOs;

namespace RidePlanner.Application.Features.Auth.Commands.LinkExternalAccount;

public sealed record LinkExternalAccountCommand(
    string LinkTicket,
    string Password) : IRequest<AuthResult>;
