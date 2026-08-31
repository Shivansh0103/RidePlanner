using MediatR;
using RidePlanner.Application.Features.Auth.DTOs;

namespace RidePlanner.Application.Features.Auth.Commands.Register;

public sealed record RegisterUserCommand(
    string Email,
    string Password) : IRequest<RegisterResponse>;
