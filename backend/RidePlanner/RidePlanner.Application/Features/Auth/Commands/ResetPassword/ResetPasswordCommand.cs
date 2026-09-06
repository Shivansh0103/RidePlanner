using MediatR;
using RidePlanner.Application.Features.Auth.DTOs;

namespace RidePlanner.Application.Features.Auth.Commands.ResetPassword;

public sealed record ResetPasswordCommand(
    Guid UserId,
    string Token,
    string NewPassword) : IRequest<ResetPasswordResponse>;
