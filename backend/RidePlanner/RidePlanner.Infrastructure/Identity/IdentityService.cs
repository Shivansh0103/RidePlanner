using System.Text;
using System.Text.Json;
using FluentValidation.Results;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Abstractions.Notifications;
using RidePlanner.Application.Exceptions;
using RidePlanner.Application.Features.Auth.DTOs;
using RidePlanner.Domain.Entities;
using RidePlanner.Domain.Exceptions;
using RidePlanner.Infrastructure.Persistence;

namespace RidePlanner.Infrastructure.Identity;

public class IdentityService : IIdentityService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IRefreshTokenService _refreshTokenService;
    private readonly RidePlannerDbContext _dbContext;
    private readonly IEmailSender _emailSender;
    private readonly IConfiguration _configuration;
    private readonly ILogger<IdentityService> _logger;
    private readonly IMemoryCache _memoryCache;
    private readonly ITimeLimitedDataProtector _linkProtector;

    public IdentityService(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IJwtTokenGenerator jwtTokenGenerator,
        IRefreshTokenService refreshTokenService,
        RidePlannerDbContext dbContext,
        IEmailSender emailSender,
        IConfiguration configuration,
        ILogger<IdentityService> logger,
        IDataProtectionProvider dataProtectionProvider,
        IMemoryCache memoryCache)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _jwtTokenGenerator = jwtTokenGenerator;
        _refreshTokenService = refreshTokenService;
        _dbContext = dbContext;
        _emailSender = emailSender;
        _configuration = configuration;
        _logger = logger;
        _memoryCache = memoryCache;
        _linkProtector = dataProtectionProvider
            .CreateProtector("RidePlanner.ExternalAccountLinking")
            .ToTimeLimitedDataProtector();
    }

    public async Task<Guid> RegisterUserAsync(
        string email,
        string password,
        CancellationToken cancellationToken = default)
    {
        var existingUser = await _userManager.FindByEmailAsync(email);
        if (existingUser != null)
        {
            throw new ConflictException($"A user with email '{email}' already exists.");
        }

        var isRelational = _dbContext.Database.IsRelational();
        IDbContextTransaction? transaction = null;

        if (isRelational)
        {
            transaction = await _dbContext.Database.BeginTransactionAsync(cancellationToken);
        }

        var user = new ApplicationUser
        {
            UserName = email,
            Email = email
        };

        try
        {
            var result = await _userManager.CreateAsync(user, password);

            if (!result.Succeeded)
            {
                if (result.Errors.Any(e => e.Code is "DuplicateEmail" or "DuplicateUserName"))
                {
                    throw new ConflictException($"A user with email '{email}' already exists.");
                }

                var failures = result.Errors.Select(e =>
                {
                    var propertyName = e.Code.Contains("Password", StringComparison.OrdinalIgnoreCase)
                        ? "Password"
                        : "Email";
                    return new ValidationFailure(propertyName, e.Description);
                });

                throw new ValidationException(failures);
            }

            // Atomically create default UserProfile for newly registered user
            var profile = UserProfile.CreateDefault(user.Id);
            _dbContext.UserProfiles.Add(profile);
            await _dbContext.SaveChangesAsync(cancellationToken);

            if (transaction != null)
            {
                await transaction.CommitAsync(cancellationToken);
            }

            return user.Id;
        }
        catch
        {
            if (transaction != null)
            {
                await transaction.RollbackAsync(cancellationToken);
            }
            else if (!isRelational && user.Id != Guid.Empty)
            {
                // In-memory test environment compensation
                await _userManager.DeleteAsync(user);
            }
            throw;
        }
        finally
        {
            if (transaction != null)
            {
                await transaction.DisposeAsync();
            }
        }
    }

    public async Task<AuthResult> LoginAsync(
        string email,
        string password,
        CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            throw new UnauthorizedException("Invalid email or password.");
        }

        var signInResult = await _signInManager.CheckPasswordSignInAsync(user, password, lockoutOnFailure: true);
        if (!signInResult.Succeeded)
        {
            throw new UnauthorizedException("Invalid email or password.");
        }

        var (token, expiresIn) = _jwtTokenGenerator.GenerateToken(user.Id, user.Email!, user.UserName);
        var (refreshToken, refreshTokenExpiresAt) = await _refreshTokenService.CreateSessionAsync(user.Id, cancellationToken);

        var loginResponse = new LoginResponse(
            AccessToken: token,
            TokenType: "Bearer",
            ExpiresIn: expiresIn,
            UserId: user.Id,
            Email: user.Email!);

        return new AuthResult(loginResponse, refreshToken, refreshTokenExpiresAt);
    }

    public async Task<AuthResult> RefreshTokenAsync(
        string rawRefreshToken,
        CancellationToken cancellationToken = default)
    {
        var (userId, newRawRefreshToken, newExpiresAt) = await _refreshTokenService.RotateTokenAsync(
            rawRefreshToken,
            cancellationToken);

        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null || await _userManager.IsLockedOutAsync(user))
        {
            throw new UnauthorizedException("Invalid refresh token.");
        }

        var (token, expiresIn) = _jwtTokenGenerator.GenerateToken(user.Id, user.Email!, user.UserName);

        var loginResponse = new LoginResponse(
            AccessToken: token,
            TokenType: "Bearer",
            ExpiresIn: expiresIn,
            UserId: user.Id,
            Email: user.Email!);

        return new AuthResult(loginResponse, newRawRefreshToken, newExpiresAt);
    }

    public async Task LogoutAsync(
        string? rawRefreshToken,
        CancellationToken cancellationToken = default)
    {
        if (!string.IsNullOrWhiteSpace(rawRefreshToken))
        {
            await _refreshTokenService.RevokeSessionAsync(rawRefreshToken, cancellationToken);
        }
    }

    public async Task ForgotPasswordAsync(
        string email,
        CancellationToken cancellationToken = default)
    {
        var maskedEmail = MaskEmail(email);
        _logger.LogInformation("Password reset requested for {MaskedEmail}", maskedEmail);

        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            // Do not reveal account non-existence; return early without sending an email
            return;
        }

        var rawToken = await _userManager.GeneratePasswordResetTokenAsync(user);
        var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(rawToken));

        var frontendBaseUrl = _configuration["App:FrontendBaseUrl"]
            ?? _configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()?.FirstOrDefault()
            ?? "http://localhost:5173";

        var resetUrl = $"{frontendBaseUrl.TrimEnd('/')}/reset-password?userId={user.Id}&token={encodedToken}";

        await _emailSender.SendPasswordResetEmailAsync(user.Email!, resetUrl, cancellationToken);
    }

    public async Task ResetPasswordAsync(
        Guid userId,
        string token,
        string newPassword,
        CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null)
        {
            _logger.LogWarning("Password reset rejected: user {UserId} not found.", userId);
            throw new DomainException("The password reset token is invalid or has expired.");
        }

        string decodedToken;
        try
        {
            var tokenBytes = WebEncoders.Base64UrlDecode(token);
            decodedToken = Encoding.UTF8.GetString(tokenBytes);
        }
        catch
        {
            decodedToken = token;
        }

        var result = await _userManager.ResetPasswordAsync(user, decodedToken, newPassword);

        // If decoding failed to match a token that was already raw (e.g. from direct test helpers), attempt raw fallback
        if (!result.Succeeded && decodedToken != token && result.Errors.Any(e => e.Code == "InvalidToken"))
        {
            var fallbackResult = await _userManager.ResetPasswordAsync(user, token, newPassword);
            if (fallbackResult.Succeeded || !fallbackResult.Errors.Any(e => e.Code == "InvalidToken"))
            {
                result = fallbackResult;
            }
        }

        if (!result.Succeeded)
        {
            if (result.Errors.Any(e => e.Code == "InvalidToken"))
            {
                _logger.LogWarning("Password reset failed for user {UserId}: Invalid or expired token.", user.Id);
                throw new DomainException("The password reset token is invalid or has expired.");
            }

            var failures = result.Errors.Select(e =>
            {
                var propertyName = e.Code.Contains("Password", StringComparison.OrdinalIgnoreCase)
                    ? "NewPassword"
                    : "Token";
                return new ValidationFailure(propertyName, e.Description);
            });

            _logger.LogWarning("Password reset failed for user {UserId}: Password policy violation.", user.Id);
            throw new ValidationException(failures);
        }

        // Revoke all active sessions (refresh tokens) in PostgreSQL
        await _refreshTokenService.RevokeAllUserSessionsAsync(user.Id, cancellationToken);

        _logger.LogInformation("Password reset succeeded for user {UserId}. All active sessions revoked.", user.Id);
    }

    private static string MaskEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
        {
            return string.Empty;
        }

        var parts = email.Split('@');
        if (parts.Length != 2)
        {
            return "***";
        }

        var name = parts[0];
        var domain = parts[1];
        if (name.Length <= 2)
        {
            return $"{name[0]}***@{domain}";
        }

        return $"{name[0]}***{name[^1]}@{domain}";
    }

    public async Task<ProcessExternalLoginResult> ProcessExternalLoginAsync(
        ExternalLoginModel loginInfo,
        string? returnUrl,
        CancellationToken cancellationToken = default)
    {
        // 1. Check if this external identity is already linked to an existing account
        var userByLogin = await _userManager.FindByLoginAsync(loginInfo.Provider, loginInfo.ProviderKey);
        if (userByLogin != null)
        {
            if (await _userManager.IsLockedOutAsync(userByLogin))
            {
                throw new UnauthorizedException("Your account is locked due to multiple failed login attempts. Please try again later.");
            }

            var authResult = await CreateAuthResultAsync(userByLogin, cancellationToken);
            return new ProcessExternalLoginResult.Success(authResult, returnUrl);
        }

        // 2. Check if a local account exists with this email (Proof of Control Required)
        var userByEmail = await _userManager.FindByEmailAsync(loginInfo.Email);
        if (userByEmail != null)
        {
            var ticketPayload = new ExternalLinkTicketPayload(
                TicketId: Guid.NewGuid(),
                UserId: userByEmail.Id,
                Email: userByEmail.Email!,
                Provider: loginInfo.Provider,
                ProviderKey: loginInfo.ProviderKey,
                ReturnUrl: returnUrl,
                CreatedAtUtc: DateTimeOffset.UtcNow);

            var json = JsonSerializer.Serialize(ticketPayload);
            var protectedTicket = _linkProtector.Protect(json, TimeSpan.FromMinutes(10));

            return new ProcessExternalLoginResult.RequiresAccountLinking(protectedTicket, returnUrl);
        }

        // 3. New user: Atomic creation of ApplicationUser + AspNetUserLogins + UserProfile
        var isRelational = _dbContext.Database.IsRelational();
        IDbContextTransaction? transaction = null;

        if (isRelational)
        {
            transaction = await _dbContext.Database.BeginTransactionAsync(cancellationToken);
        }

        var newUser = new ApplicationUser
        {
            UserName = loginInfo.Email,
            Email = loginInfo.Email,
            EmailConfirmed = true
        };

        try
        {
            var createResult = await _userManager.CreateAsync(newUser);
            if (!createResult.Succeeded)
            {
                var errorDesc = string.Join("; ", createResult.Errors.Select(e => e.Description));
                _logger.LogError("Failed to create user during external registration: {Errors}", errorDesc);
                return new ProcessExternalLoginResult.Failed("Failed to create user account.");
            }

            var addLoginResult = await _userManager.AddLoginAsync(
                newUser,
                new UserLoginInfo(loginInfo.Provider, loginInfo.ProviderKey, loginInfo.Provider));
            if (!addLoginResult.Succeeded)
            {
                var errorDesc = string.Join("; ", addLoginResult.Errors.Select(e => e.Description));
                _logger.LogError("Failed to add external login for user during external registration: {Errors}", errorDesc);
                throw new InvalidOperationException($"Failed to add external login: {errorDesc}");
            }

            var profile = UserProfile.CreateDefault(newUser.Id);
            _dbContext.UserProfiles.Add(profile);
            await _dbContext.SaveChangesAsync(cancellationToken);

            if (transaction != null)
            {
                await transaction.CommitAsync(cancellationToken);
            }

            var authResult = await CreateAuthResultAsync(newUser, cancellationToken);
            return new ProcessExternalLoginResult.Success(authResult, returnUrl);
        }
        catch
        {
            if (transaction != null)
            {
                await transaction.RollbackAsync(cancellationToken);
            }
            else if (!isRelational && newUser.Id != Guid.Empty)
            {
                await _userManager.DeleteAsync(newUser);
            }
            throw;
        }
        finally
        {
            if (transaction != null)
            {
                await transaction.DisposeAsync();
            }
        }
    }

    public async Task<AuthResult> LinkExternalAccountAsync(
        string linkTicket,
        string password,
        CancellationToken cancellationToken = default)
    {
        ExternalLinkTicketPayload payload;
        try
        {
            var json = _linkProtector.Unprotect(linkTicket);
            payload = JsonSerializer.Deserialize<ExternalLinkTicketPayload>(json)
                ?? throw new InvalidOperationException("Invalid ticket payload.");
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to unprotect account link ticket.");
            throw new UnauthorizedException("Invalid or expired account linking ticket.");
        }

        // Anti-replay check
        if (_memoryCache.TryGetValue($"spent_ticket_{payload.TicketId}", out _))
        {
            _logger.LogWarning("Attempted reuse of spent account linking ticket {TicketId}", payload.TicketId);
            throw new UnauthorizedException("This linking ticket has already been used or expired.");
        }

        // Check if provider + providerKey is already linked to any user
        var existingUserWithLogin = await _userManager.FindByLoginAsync(payload.Provider, payload.ProviderKey);
        if (existingUserWithLogin != null)
        {
            _logger.LogWarning("External identity {Provider}:{ProviderKey} is already linked to user {UserId}",
                payload.Provider, payload.ProviderKey, existingUserWithLogin.Id);
            throw new ConflictException("This external account is already linked to an account.");
        }

        var user = await _userManager.FindByIdAsync(payload.UserId.ToString());
        if (user == null)
        {
            throw new UnauthorizedException("User not found.");
        }

        var signInResult = await _signInManager.CheckPasswordSignInAsync(user, password, lockoutOnFailure: true);
        if (signInResult.IsLockedOut)
        {
            throw new UnauthorizedException("Your account is locked due to multiple failed login attempts. Please try again later.");
        }

        if (!signInResult.Succeeded)
        {
            throw new UnauthorizedException("Invalid password.");
        }

        var addLoginResult = await _userManager.AddLoginAsync(
            user,
            new UserLoginInfo(payload.Provider, payload.ProviderKey, payload.Provider));

        if (!addLoginResult.Succeeded)
        {
            var error = string.Join("; ", addLoginResult.Errors.Select(e => e.Description));
            throw new ConflictException($"Failed to link account: {error}");
        }

        // Invalidate ticket to prevent reuse
        _memoryCache.Set($"spent_ticket_{payload.TicketId}", true, TimeSpan.FromMinutes(10));

        _logger.LogInformation("Successfully linked external {Provider} account to user {UserId}", payload.Provider, user.Id);
        return await CreateAuthResultAsync(user, cancellationToken);
    }

    public ExternalLinkInfo GetLinkTicketInfo(string linkTicket)
    {
        ExternalLinkTicketPayload payload;
        try
        {
            var json = _linkProtector.Unprotect(linkTicket);
            payload = JsonSerializer.Deserialize<ExternalLinkTicketPayload>(json)
                ?? throw new InvalidOperationException("Invalid ticket payload.");
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to unprotect account link ticket for info.");
            throw new UnauthorizedException("Invalid or expired account linking ticket.");
        }

        if (_memoryCache.TryGetValue($"spent_ticket_{payload.TicketId}", out _))
        {
            throw new UnauthorizedException("This linking ticket has already been used or expired.");
        }

        var maskedEmail = MaskEmail(payload.Email);
        return new ExternalLinkInfo(maskedEmail, payload.Provider);
    }

    private async Task<AuthResult> CreateAuthResultAsync(
        ApplicationUser user,
        CancellationToken cancellationToken)
    {
        var (token, expiresIn) = _jwtTokenGenerator.GenerateToken(user.Id, user.Email!, user.UserName);
        var (refreshToken, refreshTokenExpiresAt) = await _refreshTokenService.CreateSessionAsync(user.Id, cancellationToken);

        var loginResponse = new LoginResponse(
            AccessToken: token,
            TokenType: "Bearer",
            ExpiresIn: expiresIn,
            UserId: user.Id,
            Email: user.Email!);

        return new AuthResult(loginResponse, refreshToken, refreshTokenExpiresAt);
    }
}
