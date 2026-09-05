using MediatR;
using RidePlanner.Application.Abstractions.Identity;

namespace RidePlanner.Application.Features.Auth.Commands.Logout;

public sealed class LogoutUserCommandHandler : IRequestHandler<LogoutUserCommand>
{
    private readonly IIdentityService _identityService;

    public LogoutUserCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task Handle(
        LogoutUserCommand request,
        CancellationToken cancellationToken)
    {
        await _identityService.LogoutAsync(
            request.RefreshToken,
            cancellationToken);
    }
}
