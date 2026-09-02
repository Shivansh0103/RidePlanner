using MediatR;
using Microsoft.AspNetCore.Mvc;
using RidePlanner.Api.Common;
using RidePlanner.Application.Features.Auth.Commands.Login;
using RidePlanner.Application.Features.Auth.Commands.Refresh;
using RidePlanner.Application.Features.Auth.Commands.Register;
using RidePlanner.Application.Features.Auth.DTOs;
using RidePlanner.Domain.Exceptions;

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
        var authResult = await _sender.Send(command, cancellationToken);

        AuthCookieHelper.SetRefreshTokenCookie(
            Response,
            authResult.RefreshToken,
            authResult.RefreshTokenExpiresAt,
            Request.IsHttps);

        return Ok(authResult.Response);
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<LoginResponse>> Refresh(
        CancellationToken cancellationToken)
    {
        var refreshToken = Request.Cookies[AuthCookieHelper.RefreshTokenCookieName];
        if (string.IsNullOrWhiteSpace(refreshToken))
        {
            throw new UnauthorizedException("Invalid or missing refresh token.");
        }

        var command = new RefreshTokenCommand(refreshToken);
        var authResult = await _sender.Send(command, cancellationToken);

        AuthCookieHelper.SetRefreshTokenCookie(
            Response,
            authResult.RefreshToken,
            authResult.RefreshTokenExpiresAt,
            Request.IsHttps);

        return Ok(authResult.Response);
    }
}
