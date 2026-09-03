using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using RidePlanner.Infrastructure.Identity;

namespace RidePlanner.Api.IntegrationTests;

public class CurrentUserServiceTests
{
    [Fact]
    public void IsAuthenticated_ShouldReturnFalse_WhenHttpContextIsNull()
    {
        var accessor = new HttpContextAccessor { HttpContext = null };
        var service = new CurrentUserService(accessor);

        Assert.False(service.IsAuthenticated);
    }

    [Fact]
    public void IsAuthenticated_ShouldReturnFalse_WhenUserIsNotAuthenticated()
    {
        var context = new DefaultHttpContext();
        var accessor = new HttpContextAccessor { HttpContext = context };
        var service = new CurrentUserService(accessor);

        Assert.False(service.IsAuthenticated);
    }

    [Fact]
    public void IsAuthenticated_ShouldReturnTrue_WhenUserIsAuthenticated()
    {
        var context = new DefaultHttpContext();
        var identity = new ClaimsIdentity("TestAuthType");
        context.User = new ClaimsPrincipal(identity);
        var accessor = new HttpContextAccessor { HttpContext = context };
        var service = new CurrentUserService(accessor);

        Assert.True(service.IsAuthenticated);
    }

    [Fact]
    public void UserId_ShouldReturnNull_WhenUserIsNotAuthenticated()
    {
        var context = new DefaultHttpContext();
        var accessor = new HttpContextAccessor { HttpContext = context };
        var service = new CurrentUserService(accessor);

        Assert.Null(service.UserId);
    }

    [Fact]
    public void UserId_ShouldReturnGuid_WhenSubClaimIsPresentAndValidGuid()
    {
        var expectedUserId = Guid.NewGuid();
        var context = new DefaultHttpContext();
        var identity = new ClaimsIdentity(new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, expectedUserId.ToString())
        }, "TestAuthType");
        context.User = new ClaimsPrincipal(identity);
        var accessor = new HttpContextAccessor { HttpContext = context };
        var service = new CurrentUserService(accessor);

        Assert.Equal(expectedUserId, service.UserId);
    }

    [Fact]
    public void UserId_ShouldReturnGuid_WhenNameIdentifierClaimIsPresentAndValidGuid()
    {
        var expectedUserId = Guid.NewGuid();
        var context = new DefaultHttpContext();
        var identity = new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.NameIdentifier, expectedUserId.ToString())
        }, "TestAuthType");
        context.User = new ClaimsPrincipal(identity);
        var accessor = new HttpContextAccessor { HttpContext = context };
        var service = new CurrentUserService(accessor);

        Assert.Equal(expectedUserId, service.UserId);
    }

    [Fact]
    public void UserId_ShouldReturnNull_WhenSubClaimIsNotValidGuid()
    {
        var context = new DefaultHttpContext();
        var identity = new ClaimsIdentity(new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, "not-a-guid")
        }, "TestAuthType");
        context.User = new ClaimsPrincipal(identity);
        var accessor = new HttpContextAccessor { HttpContext = context };
        var service = new CurrentUserService(accessor);

        Assert.Null(service.UserId);
    }
}
