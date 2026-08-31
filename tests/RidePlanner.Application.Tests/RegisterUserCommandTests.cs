using FluentValidation.TestHelper;
using Moq;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Features.Auth.Commands.Register;

namespace RidePlanner.Application.Tests;

public class RegisterUserCommandTests
{
    private readonly RegisterUserCommandValidator _validator = new();
    private readonly Mock<IIdentityService> _identityServiceMock = new();

    [Fact]
    public void Validator_ShouldHaveError_WhenEmailIsEmpty()
    {
        var command = new RegisterUserCommand("", "Secret123!");
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Fact]
    public void Validator_ShouldHaveError_WhenEmailIsInvalid()
    {
        var command = new RegisterUserCommand("invalid-email", "Secret123!");
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Fact]
    public void Validator_ShouldHaveError_WhenPasswordIsEmpty()
    {
        var command = new RegisterUserCommand("test@example.com", "");
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Password);
    }

    [Fact]
    public void Validator_ShouldHaveError_WhenPasswordIsTooShort()
    {
        var command = new RegisterUserCommand("test@example.com", "12345");
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Password);
    }

    [Fact]
    public void Validator_ShouldPass_WhenCommandIsValid()
    {
        var command = new RegisterUserCommand("test@example.com", "ValidSecret123!");
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public async Task Handler_ShouldCallIdentityService_AndReturnRegisterResponse()
    {
        // Arrange
        var expectedUserId = Guid.NewGuid();
        var email = "rider@example.com";
        var password = "Password123!";
        var command = new RegisterUserCommand(email, password);

        _identityServiceMock
            .Setup(s => s.RegisterUserAsync(email, password, It.IsAny<CancellationToken>()))
            .ReturnsAsync(expectedUserId);

        var handler = new RegisterUserCommandHandler(_identityServiceMock.Object);

        // Act
        var response = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.NotNull(response);
        Assert.Equal(expectedUserId, response.Id);
        Assert.Equal(email, response.Email);
        _identityServiceMock.Verify(s => s.RegisterUserAsync(email, password, It.IsAny<CancellationToken>()), Times.Once);
    }
}
