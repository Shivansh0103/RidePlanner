using FluentValidation.TestHelper;
using Moq;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Features.Auth.Commands.ForgotPassword;

namespace RidePlanner.Application.Tests;

public class ForgotPasswordCommandTests
{
    private readonly ForgotPasswordCommandValidator _validator = new();
    private readonly Mock<IIdentityService> _identityServiceMock = new();

    [Fact]
    public void Validator_ShouldHaveError_WhenEmailIsEmpty()
    {
        var command = new ForgotPasswordCommand("");
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Fact]
    public void Validator_ShouldHaveError_WhenEmailIsInvalid()
    {
        var command = new ForgotPasswordCommand("invalid-email");
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Fact]
    public void Validator_ShouldPass_WhenEmailIsValid()
    {
        var command = new ForgotPasswordCommand("rider@example.com");
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public async Task Handler_ShouldCallIdentityService_AndReturnGenericSuccessMessage()
    {
        // Arrange
        var email = "rider@example.com";
        var command = new ForgotPasswordCommand(email);

        _identityServiceMock
            .Setup(s => s.ForgotPasswordAsync(email, It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        var handler = new ForgotPasswordCommandHandler(_identityServiceMock.Object);

        // Act
        var response = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.NotNull(response);
        Assert.Equal(ForgotPasswordCommandHandler.SuccessMessage, response.Message);
        _identityServiceMock.Verify(s => s.ForgotPasswordAsync(email, It.IsAny<CancellationToken>()), Times.Once);
    }
}
