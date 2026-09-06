using MediatR;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Features.Auth.DTOs;

namespace RidePlanner.Application.Features.Auth.Commands.ForgotPassword;

public sealed class ForgotPasswordCommandHandler : IRequestHandler<ForgotPasswordCommand, ForgotPasswordResponse>
{
    private readonly IIdentityService _identityService;
    public const string SuccessMessage = "If an account exists with that email address, password reset instructions have been sent.";

    public ForgotPasswordCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<ForgotPasswordResponse> Handle(
        ForgotPasswordCommand request,
        CancellationToken cancellationToken)
    {
        await _identityService.ForgotPasswordAsync(request.Email, cancellationToken);
        return new ForgotPasswordResponse(SuccessMessage);
    }
}
