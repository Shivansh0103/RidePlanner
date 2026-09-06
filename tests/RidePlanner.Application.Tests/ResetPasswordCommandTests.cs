using FluentValidation.TestHelper;
using Moq;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Features.Auth.Commands.ResetPassword;

namespace RidePlanner.Application.Tests;

public class ResetPasswordCommandTests
{
    private readonly ResetPasswordCommandValidator _validator = new();
    private readonly Mock<IIdentityService> _identityServiceMock = new();

    [Fact]
    public void Validator_ShouldHaveError_WhenUserIdIsEmpty()
    {
        var command = new ResetPasswordCommand(Guid.Empty, "token-123", "NewSecret123!");
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.UserId);
    }

    [Fact]
    public void Validator_ShouldHaveError_WhenTokenIsEmpty()
    {
        var command = new ResetPasswordCommand(Guid.NewGuid(), "", "NewSecret123!");
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Token);
    }

    [Fact]
    public void Validator_ShouldHaveError_WhenNewPasswordIsEmpty()
    {
        var command = new ResetPasswordCommand(Guid.NewGuid(), "token-123", "");
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.NewPassword);
    }

    [Fact]
    public void Validator_ShouldHaveError_WhenNewPasswordIsTooShort()
    {
        var command = new ResetPasswordCommand(Guid.NewGuid(), "token-123", "12345");
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.NewPassword);
    }

    [Fact]
    public void Validator_ShouldPass_WhenCommandIsValid()
    {
        var command = new ResetPasswordCommand(Guid.NewGuid(), "token-123", "ValidNewSecret123!");
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public async Task Handler_ShouldCallIdentityService_AndReturnSuccessResponse()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var token = "token-123";
        var newPassword = "ValidNewSecret123!";
        var command = new ResetPasswordCommand(userId, token, newPassword);

        _identityServiceMock
            .Setup(s => s.ResetPasswordAsync(userId, token, newPassword, It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        var handler = new ResetPasswordCommandHandler(_identityServiceMock.Object);

        // Act
        var response = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.NotNull(response);
        Assert.Equal(ResetPasswordCommandHandler.SuccessMessage, response.Message);
        _identityServiceMock.Verify(s => s.ResetPasswordAsync(userId, token, newPassword, It.IsAny<CancellationToken>()), Times.Once);
    }
}
