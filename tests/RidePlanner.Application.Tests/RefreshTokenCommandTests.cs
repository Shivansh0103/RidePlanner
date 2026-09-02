using FluentValidation.TestHelper;
using Moq;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Features.Auth.Commands.Refresh;
using RidePlanner.Application.Features.Auth.DTOs;

namespace RidePlanner.Application.Tests;

public class RefreshTokenCommandTests
{
    private readonly RefreshTokenCommandValidator _validator = new();
    private readonly Mock<IIdentityService> _identityServiceMock = new();

    [Fact]
    public void Validator_ShouldHaveError_WhenRefreshTokenIsEmpty()
    {
        var command = new RefreshTokenCommand("");
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.RefreshToken);
    }

    [Fact]
    public void Validator_ShouldPass_WhenRefreshTokenIsProvided()
    {
        var command = new RefreshTokenCommand("valid-refresh-token");
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public async Task Handler_ShouldCallIdentityService_AndReturnAuthResult()
    {
        // Arrange
        var rawToken = "raw-refresh-token";
        var newRawToken = "new-raw-refresh-token";
        var command = new RefreshTokenCommand(rawToken);
        var expectedLoginResponse = new LoginResponse(
            AccessToken: "new-fake-jwt-token",
            TokenType: "Bearer",
            ExpiresIn: 900,
            UserId: Guid.NewGuid(),
            Email: "rider@example.com");
        var expectedResult = new AuthResult(
            expectedLoginResponse,
            newRawToken,
            DateTimeOffset.UtcNow.AddDays(30));

        _identityServiceMock
            .Setup(s => s.RefreshTokenAsync(rawToken, It.IsAny<CancellationToken>()))
            .ReturnsAsync(expectedResult);

        var handler = new RefreshTokenCommandHandler(_identityServiceMock.Object);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("new-fake-jwt-token", result.Response.AccessToken);
        Assert.Equal(newRawToken, result.RefreshToken);
        _identityServiceMock.Verify(s => s.RefreshTokenAsync(rawToken, It.IsAny<CancellationToken>()), Times.Once);
    }
}
