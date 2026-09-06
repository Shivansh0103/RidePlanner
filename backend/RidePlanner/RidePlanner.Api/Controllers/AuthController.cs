using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RidePlanner.Api.Common;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Features.Auth.Commands.ForgotPassword;
using RidePlanner.Application.Features.Auth.Commands.Login;
using RidePlanner.Application.Features.Auth.Commands.Logout;
using RidePlanner.Application.Features.Auth.Commands.Refresh;
using RidePlanner.Application.Features.Auth.Commands.Register;
using RidePlanner.Application.Features.Auth.Commands.ResetPassword;
using RidePlanner.Application.Features.Auth.DTOs;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ISender _sender;
    private readonly ICurrentUserService _currentUserService;

    public AuthController(ISender sender, ICurrentUserService currentUserService)
    {
        _sender = sender;
        _currentUserService = currentUserService;
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

    [HttpPost("logout")]
    public async Task<IActionResult> Logout(CancellationToken cancellationToken)
    {
        var refreshToken = Request.Cookies[AuthCookieHelper.RefreshTokenCookieName];
        if (!string.IsNullOrWhiteSpace(refreshToken))
        {
            await _sender.Send(new LogoutUserCommand(refreshToken), cancellationToken);
        }

        AuthCookieHelper.ClearRefreshTokenCookie(Response, Request.IsHttps);
        return Ok();
    }

    [HttpPost("forgot-password")]
    public async Task<ActionResult<ForgotPasswordResponse>> ForgotPassword(
        [FromBody] ForgotPasswordRequest request,
        CancellationToken cancellationToken)
    {
        var command = new ForgotPasswordCommand(request.Email);
        var response = await _sender.Send(command, cancellationToken);
        return Ok(response);
    }

    [HttpPost("reset-password")]
    public async Task<ActionResult<ResetPasswordResponse>> ResetPassword(
        [FromBody] ResetPasswordRequest request,
        CancellationToken cancellationToken)
    {
        var command = new ResetPasswordCommand(request.UserId, request.Token, request.NewPassword);
        var response = await _sender.Send(command, cancellationToken);
        return Ok(response);
    }

    [Authorize]
    [HttpGet("me")]
    public ActionResult<CurrentUserResponse> GetCurrentUser()
    {
        return Ok(new CurrentUserResponse(
            _currentUserService.UserId,
            _currentUserService.IsAuthenticated));
    }
}
