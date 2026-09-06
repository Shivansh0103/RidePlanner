using MediatR;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Features.Auth.DTOs;

namespace RidePlanner.Application.Features.Auth.Commands.ResetPassword;

public sealed class ResetPasswordCommandHandler : IRequestHandler<ResetPasswordCommand, ResetPasswordResponse>
{
    private readonly IIdentityService _identityService;
    public const string SuccessMessage = "Password has been reset successfully. You may now log in with your new credentials.";

    public ResetPasswordCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<ResetPasswordResponse> Handle(
        ResetPasswordCommand request,
        CancellationToken cancellationToken)
    {
        await _identityService.ResetPasswordAsync(
            request.UserId,
            request.Token,
            request.NewPassword,
            cancellationToken);

        return new ResetPasswordResponse(SuccessMessage);
    }
}
