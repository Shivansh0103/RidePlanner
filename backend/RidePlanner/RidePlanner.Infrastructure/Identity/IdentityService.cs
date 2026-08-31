using FluentValidation.Results;
using Microsoft.AspNetCore.Identity;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Exceptions;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Infrastructure.Identity;

public class IdentityService : IIdentityService
{
    private readonly UserManager<ApplicationUser> _userManager;

    public IdentityService(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
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

        var user = new ApplicationUser
        {
            UserName = email,
            Email = email
        };

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

        return user.Id;
    }
}
