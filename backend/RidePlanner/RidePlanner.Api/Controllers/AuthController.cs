using MediatR;
using Microsoft.AspNetCore.Mvc;
using RidePlanner.Application.Features.Auth.Commands.Login;
using RidePlanner.Application.Features.Auth.Commands.Register;
using RidePlanner.Application.Features.Auth.DTOs;

namespace RidePlanner.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ISender _sender;

    public AuthController(ISender sender)
    {
        _sender = sender;
    }

    [HttpPost("register")]
    public async Task<ActionResult<RegisterResponse>> Register(
        [FromBody] RegisterRequest request,
        CancellationToken cancellationToken)
    {
        var command = new RegisterUserCommand(request.Email, request.Password);
        var response = await _sender.Send(command, cancellationToken);
        return Ok(response);
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(
        [FromBody] LoginRequest request,
        CancellationToken cancellationToken)
    {
        var command = new LoginUserCommand(request.Email, request.Password);
        var response = await _sender.Send(command, cancellationToken);
        return Ok(response);
    }
}
