using MediatR;
using RidePlanner.Application.Features.Auth.DTOs;

namespace RidePlanner.Application.Features.Auth.Commands.Login;

public sealed record LoginUserCommand(
    string Email,
    string Password) : IRequest<AuthResult>;
