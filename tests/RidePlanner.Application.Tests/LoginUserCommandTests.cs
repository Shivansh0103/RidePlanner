using FluentValidation.TestHelper;
using Moq;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Features.Auth.Commands.Login;
using RidePlanner.Application.Features.Auth.DTOs;

namespace RidePlanner.Application.Tests;

public class LoginUserCommandTests
{
    private readonly LoginUserCommandValidator _validator = new();
    private readonly Mock<IIdentityService> _identityServiceMock = new();

    [Fact]
    public void Validator_ShouldHaveError_WhenEmailIsEmpty()
    {
        var command = new LoginUserCommand("", "Secret123!");
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Fact]
    public void Validator_ShouldHaveError_WhenEmailIsInvalid()
    {
        var command = new LoginUserCommand("invalid-email", "Secret123!");
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Fact]
    public void Validator_ShouldHaveError_WhenPasswordIsEmpty()
    {
        var command = new LoginUserCommand("test@example.com", "");
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Password);
    }

    [Fact]
    public void Validator_ShouldPass_WhenCommandIsValid()
    {
        var command = new LoginUserCommand("test@example.com", "ValidSecret123!");
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public async Task Handler_ShouldCallIdentityService_AndReturnLoginResponse()
    {
        // Arrange
        var expectedUserId = Guid.NewGuid();
        var email = "rider@example.com";
        var password = "Password123!";
        var command = new LoginUserCommand(email, password);
        var expectedResponse = new LoginResponse(
            AccessToken: "fake-jwt-token",
            TokenType: "Bearer",
            ExpiresIn: 900,
            UserId: expectedUserId,
            Email: email);

        _identityServiceMock
            .Setup(s => s.LoginAsync(email, password, It.IsAny<CancellationToken>()))
            .ReturnsAsync(expectedResponse);

        var handler = new LoginUserCommandHandler(_identityServiceMock.Object);

        // Act
        var response = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.NotNull(response);
        Assert.Equal("fake-jwt-token", response.AccessToken);
        Assert.Equal("Bearer", response.TokenType);
        Assert.Equal(900, response.ExpiresIn);
        Assert.Equal(expectedUserId, response.UserId);
        Assert.Equal(email, response.Email);
        _identityServiceMock.Verify(s => s.LoginAsync(email, password, It.IsAny<CancellationToken>()), Times.Once);
    }
}
