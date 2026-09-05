using FluentValidation.TestHelper;
using Moq;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Exceptions;
using RidePlanner.Application.Features.Users.Commands.UpdateUserProfile;
using RidePlanner.Application.Features.Users.Queries.GetUserProfile;
using RidePlanner.Domain.Entities;
using RidePlanner.Domain.Enums;

namespace RidePlanner.Application.Tests;

public class UserProfileCommandAndQueryTests
{
    private readonly UpdateUserProfileCommandValidator _validator = new();
    private readonly Mock<IUserProfileRepository> _userProfileRepositoryMock = new();
    private readonly Mock<IUnitOfWork> _unitOfWorkMock = new();
    private readonly Mock<ICurrentUserService> _currentUserServiceMock = new();

    [Fact]
    public void Validator_ShouldHaveError_WhenCurrencyIsEmpty()
    {
        var command = new UpdateUserProfileCommand("", DistanceUnit.Kilometers, null, null, null);
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.PreferredCurrencyCode);
    }

    [Theory]
    [InlineData("JPY")]
    [InlineData("XYZ")]
    [InlineData("AUD")]
    public void Validator_ShouldHaveError_WhenCurrencyIsUnsupported(string unsupportedCurrency)
    {
        var command = new UpdateUserProfileCommand(unsupportedCurrency, DistanceUnit.Kilometers, null, null, null);
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.PreferredCurrencyCode);
    }

    [Theory]
    [InlineData("INR")]
    [InlineData("USD")]
    [InlineData("EUR")]
    [InlineData("GBP")]
    [InlineData("inr")]
    [InlineData("usd")]
    public void Validator_ShouldPass_ForSupportedCurrencies(string currency)
    {
        var command = new UpdateUserProfileCommand(currency, DistanceUnit.Kilometers, null, null, null);
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveValidationErrorFor(x => x.PreferredCurrencyCode);
    }

    [Fact]
    public void Validator_ShouldHaveError_WhenVehicleNameExceeds100Characters()
    {
        var longVehicleName = new string('A', 101);
        var command = new UpdateUserProfileCommand("INR", DistanceUnit.Kilometers, longVehicleName, null, null);
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.DefaultVehicleName);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-5)]
    [InlineData(1001)]
    public void Validator_ShouldHaveError_WhenTankCapacityIsInvalid(decimal invalidTank)
    {
        var command = new UpdateUserProfileCommand("INR", DistanceUnit.Kilometers, null, invalidTank, null);
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.DefaultTankCapacityLitres);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-10)]
    [InlineData(201)]
    public void Validator_ShouldHaveError_WhenFuelEfficiencyIsInvalid(decimal invalidMileage)
    {
        var command = new UpdateUserProfileCommand("INR", DistanceUnit.Kilometers, null, null, invalidMileage);
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.DefaultFuelEfficiencyKmPerLitre);
    }

    [Fact]
    public void Validator_ShouldPass_WhenAllFieldsAreValid()
    {
        var command = new UpdateUserProfileCommand("USD", DistanceUnit.Miles, "BMW R1250GS", 20m, 18.5m);
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public async Task UpdateHandler_ShouldThrowUnauthorizedException_WhenUserNotAuthenticated()
    {
        _currentUserServiceMock.Setup(s => s.UserId).Returns((Guid?)null);
        var handler = new UpdateUserProfileCommandHandler(
            _userProfileRepositoryMock.Object,
            _unitOfWorkMock.Object,
            _currentUserServiceMock.Object);

        var command = new UpdateUserProfileCommand("INR", DistanceUnit.Kilometers, null, null, null);

        await Assert.ThrowsAsync<UnauthorizedException>(() => handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task UpdateHandler_ShouldThrowNotFoundException_WhenProfileDoesNotExist()
    {
        var userId = Guid.NewGuid();
        _currentUserServiceMock.Setup(s => s.UserId).Returns(userId);
        _userProfileRepositoryMock
            .Setup(r => r.GetByUserIdAsync(userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((UserProfile?)null);

        var handler = new UpdateUserProfileCommandHandler(
            _userProfileRepositoryMock.Object,
            _unitOfWorkMock.Object,
            _currentUserServiceMock.Object);

        var command = new UpdateUserProfileCommand("INR", DistanceUnit.Kilometers, null, null, null);

        await Assert.ThrowsAsync<NotFoundException>(() => handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task UpdateHandler_ShouldUpdateProfile_AndCallUnitOfWork_WhenValid()
    {
        var userId = Guid.NewGuid();
        var profile = UserProfile.CreateDefault(userId);

        _currentUserServiceMock.Setup(s => s.UserId).Returns(userId);
        _userProfileRepositoryMock
            .Setup(r => r.GetByUserIdAsync(userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(profile);

        var handler = new UpdateUserProfileCommandHandler(
            _userProfileRepositoryMock.Object,
            _unitOfWorkMock.Object,
            _currentUserServiceMock.Object);

        var command = new UpdateUserProfileCommand("EUR", DistanceUnit.Kilometers, "Ducati DesertX", 21m, 17m);
        var result = await handler.Handle(command, CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal("EUR", result.PreferredCurrencyCode);
        Assert.Equal("Ducati DesertX", result.DefaultVehicleName);
        Assert.Equal(21m, result.DefaultTankCapacityLitres);
        Assert.Equal(17m, result.DefaultFuelEfficiencyKmPerLitre);
        _unitOfWorkMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task GetHandler_ShouldThrowUnauthorizedException_WhenUserNotAuthenticated()
    {
        _currentUserServiceMock.Setup(s => s.UserId).Returns((Guid?)null);
        var handler = new GetUserProfileQueryHandler(
            _userProfileRepositoryMock.Object,
            _currentUserServiceMock.Object);

        await Assert.ThrowsAsync<UnauthorizedException>(() => handler.Handle(new GetUserProfileQuery(), CancellationToken.None));
    }

    [Fact]
    public async Task GetHandler_ShouldThrowNotFoundException_WhenProfileDoesNotExist()
    {
        var userId = Guid.NewGuid();
        _currentUserServiceMock.Setup(s => s.UserId).Returns(userId);
        _userProfileRepositoryMock
            .Setup(r => r.GetByUserIdAsync(userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((UserProfile?)null);

        var handler = new GetUserProfileQueryHandler(
            _userProfileRepositoryMock.Object,
            _currentUserServiceMock.Object);

        await Assert.ThrowsAsync<NotFoundException>(() => handler.Handle(new GetUserProfileQuery(), CancellationToken.None));
    }

    [Fact]
    public async Task GetHandler_ShouldReturnDto_WhenProfileExists()
    {
        var userId = Guid.NewGuid();
        var profile = UserProfile.CreateDefault(userId);

        _currentUserServiceMock.Setup(s => s.UserId).Returns(userId);
        _userProfileRepositoryMock
            .Setup(r => r.GetByUserIdAsync(userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(profile);

        var handler = new GetUserProfileQueryHandler(
            _userProfileRepositoryMock.Object,
            _currentUserServiceMock.Object);

        var result = await handler.Handle(new GetUserProfileQuery(), CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal("INR", result.PreferredCurrencyCode);
        Assert.Equal("Kilometers", result.DistanceUnit);
        Assert.Null(result.DefaultVehicleName);
    }
}
