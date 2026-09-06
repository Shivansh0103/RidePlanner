using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RidePlanner.Api.Common;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Features.Auth.Commands.ForgotPassword;
using RidePlanner.Application.Features.Auth.Commands.LinkExternalAccount;
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
    private readonly IIdentityService _identityService;
    private readonly IConfiguration _configuration;

    public AuthController(
        ISender sender,
        ICurrentUserService currentUserService,
        IIdentityService identityService,
        IConfiguration configuration)
    {
        _sender = sender;
        _currentUserService = currentUserService;
        _identityService = identityService;
        _configuration = configuration;
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

    [HttpGet("external/google/start")]
    public IActionResult StartGoogleLogin([FromQuery] string? returnUrl)
    {
        var sanitizedReturnUrl = ReturnUrlValidator.Sanitize(returnUrl);
        var callbackUrl = Url.Action(nameof(GoogleCallback), "Auth", new { returnUrl = sanitizedReturnUrl });
        var properties = new AuthenticationProperties
        {
            RedirectUri = callbackUrl,
            Items = { { "returnUrl", sanitizedReturnUrl } }
        };

        return Challenge(properties, "Google");
    }

    [HttpGet("external/google/callback")]
    public async Task<IActionResult> GoogleCallback(
        [FromQuery] string? returnUrl,
        CancellationToken cancellationToken)
    {
        var frontendBaseUrl = _configuration["App:FrontendBaseUrl"] ?? "http://localhost:5173";
        var sanitizedReturnUrl = ReturnUrlValidator.Sanitize(returnUrl);

        var authenticateResult = await HttpContext.AuthenticateAsync(IdentityConstants.ExternalScheme);
        if (!authenticateResult.Succeeded || authenticateResult.Principal == null)
        {
            return Redirect($"{frontendBaseUrl}/login?error=external_auth_failed");
        }

        var provider = "Google";
        var providerKey = authenticateResult.Principal.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? authenticateResult.Principal.FindFirstValue("sub");
        var email = authenticateResult.Principal.FindFirstValue(ClaimTypes.Email);
        var name = authenticateResult.Principal.FindFirstValue(ClaimTypes.Name);

        if (string.IsNullOrWhiteSpace(providerKey) || string.IsNullOrWhiteSpace(email))
        {
            await HttpContext.SignOutAsync(IdentityConstants.ExternalScheme);
            return Redirect($"{frontendBaseUrl}/login?error=external_auth_missing_claims");
        }

        if (authenticateResult.Properties?.Items.TryGetValue("returnUrl", out var propsReturnUrl) == true &&
            !string.IsNullOrWhiteSpace(propsReturnUrl))
        {
            sanitizedReturnUrl = ReturnUrlValidator.Sanitize(propsReturnUrl);
        }

        var externalModel = new ExternalLoginModel(provider, providerKey, email, name);
        var processResult = await _identityService.ProcessExternalLoginAsync(
            externalModel,
            sanitizedReturnUrl,
            cancellationToken);

        await HttpContext.SignOutAsync(IdentityConstants.ExternalScheme);

        return processResult switch
        {
            ProcessExternalLoginResult.Success success => HandleSuccessfulExternalLogin(success, frontendBaseUrl),
            ProcessExternalLoginResult.RequiresAccountLinking linking => Redirect(
                $"{frontendBaseUrl}/auth/link-account?ticket={Uri.EscapeDataString(linking.LinkTicket)}"),
            ProcessExternalLoginResult.Failed failed => Redirect(
                $"{frontendBaseUrl}/login?error={Uri.EscapeDataString(failed.ErrorMessage)}"),
            _ => Redirect($"{frontendBaseUrl}/login?error=external_auth_failed")
        };
    }

    [HttpGet("external/link-info")]
    public ActionResult<ExternalLinkInfo> GetLinkInfo([FromQuery] string ticket)
    {
        if (string.IsNullOrWhiteSpace(ticket))
        {
            return BadRequest(new { message = "Link ticket cannot be empty." });
        }

        var info = _identityService.GetLinkTicketInfo(ticket);
        return Ok(info);
    }

    [HttpPost("external/link")]
    public async Task<ActionResult<LoginResponse>> LinkAccount(
        [FromBody] LinkExternalAccountRequest request,
        CancellationToken cancellationToken)
    {
        var command = new LinkExternalAccountCommand(request.LinkTicket, request.Password);
        var authResult = await _sender.Send(command, cancellationToken);

        AuthCookieHelper.SetRefreshTokenCookie(
            Response,
            authResult.RefreshToken,
            authResult.RefreshTokenExpiresAt,
            Request.IsHttps);

        return Ok(authResult.Response);
    }

    private IActionResult HandleSuccessfulExternalLogin(
        ProcessExternalLoginResult.Success success,
        string frontendBaseUrl)
    {
        AuthCookieHelper.SetRefreshTokenCookie(
            Response,
            success.AuthResult.RefreshToken,
            success.AuthResult.RefreshTokenExpiresAt,
            Request.IsHttps);

        var sanitizedReturnUrl = ReturnUrlValidator.Sanitize(success.ReturnUrl);
        var destination = $"{frontendBaseUrl}/auth/callback?status=success&returnUrl={Uri.EscapeDataString(sanitizedReturnUrl)}";
        return Redirect(destination);
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
