using MediatR;

namespace RidePlanner.Application.Features.Auth.Commands.Logout;

public sealed record LogoutUserCommand(
    string? RefreshToken) : IRequest;
