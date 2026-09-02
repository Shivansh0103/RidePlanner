using MediatR;
using RidePlanner.Application.Features.Auth.DTOs;

namespace RidePlanner.Application.Features.Auth.Commands.Refresh;

public sealed record RefreshTokenCommand(
    string RefreshToken) : IRequest<AuthResult>;
