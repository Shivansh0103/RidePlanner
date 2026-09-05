using FluentValidation.Results;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using RidePlanner.Application.Abstractions.Identity;
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

    public IdentityService(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IJwtTokenGenerator jwtTokenGenerator,
        IRefreshTokenService refreshTokenService,
        RidePlannerDbContext dbContext)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _jwtTokenGenerator = jwtTokenGenerator;
        _refreshTokenService = refreshTokenService;
        _dbContext = dbContext;
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
}
