using MediatR;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Features.Auth.DTOs;

namespace RidePlanner.Application.Features.Auth.Commands.Register;

public sealed class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand, RegisterResponse>
{
    private readonly IIdentityService _identityService;

    public RegisterUserCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<RegisterResponse> Handle(
        RegisterUserCommand request,
        CancellationToken cancellationToken)
    {
        var userId = await _identityService.RegisterUserAsync(
            request.Email,
            request.Password,
            cancellationToken);

        return new RegisterResponse(userId, request.Email);
    }
}
