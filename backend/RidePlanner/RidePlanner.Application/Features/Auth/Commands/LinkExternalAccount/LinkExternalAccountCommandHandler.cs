using MediatR;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Features.Auth.DTOs;

namespace RidePlanner.Application.Features.Auth.Commands.LinkExternalAccount;

public sealed class LinkExternalAccountCommandHandler : IRequestHandler<LinkExternalAccountCommand, AuthResult>
{
    private readonly IIdentityService _identityService;

    public LinkExternalAccountCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<AuthResult> Handle(
        LinkExternalAccountCommand request,
        CancellationToken cancellationToken)
    {
        return await _identityService.LinkExternalAccountAsync(
            request.LinkTicket,
            request.Password,
            cancellationToken);
    }
}
