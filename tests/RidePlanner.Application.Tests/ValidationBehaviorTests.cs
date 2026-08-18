using FluentValidation;
using MediatR;
using RidePlanner.Application.Behaviors;
using RidePlanner.Application.Features.Trips.Commands.CreateTrip;
using RidePlanner.Domain.Entities;
using ValidationException = RidePlanner.Application.Exceptions.ValidationException;

namespace RidePlanner.Application.Tests;

public class ValidationBehaviorTests
{
    [Fact]
    public async Task ValidationBehavior_Throws_ValidationException_When_Validation_Fails()
    {
        // Arrange: Create validator and pipeline behavior
        var validator = new CreateTripCommandValidator();
        var behavior = new ValidationBehavior<CreateTripCommand, Trip>(new[] { validator });

        // Invalid command: Empty name and end date before start date
        var invalidCommand = new CreateTripCommand(
            "",
            "Description",
            new DateOnly(2026, 8, 10),
            new DateOnly(2026, 8, 5));

        RequestHandlerDelegate<Trip> next = (ct) => Task.FromResult(Trip.Create("Valid", null, new DateOnly(2026, 8, 1), new DateOnly(2026, 8, 5)));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ValidationException>(() =>
            behavior.Handle(invalidCommand, next, CancellationToken.None));

        Assert.NotNull(exception.Errors);
        Assert.True(exception.Errors.ContainsKey("Name"));
        Assert.True(exception.Errors.ContainsKey("EndDate"));
    }

    [Fact]
    public async Task ValidationBehavior_Calls_Next_When_Validation_Succeeds()
    {
        // Arrange
        var validator = new CreateTripCommandValidator();
        var behavior = new ValidationBehavior<CreateTripCommand, Trip>(new[] { validator });

        var validCommand = new CreateTripCommand(
            "Ladakh Ride",
            "Tour",
            new DateOnly(2026, 8, 1),
            new DateOnly(2026, 8, 10));

        var expectedTrip = Trip.Create("Ladakh Ride", "Tour", new DateOnly(2026, 8, 1), new DateOnly(2026, 8, 10));
        bool nextCalled = false;
        RequestHandlerDelegate<Trip> next = (ct) =>
        {
            nextCalled = true;
            return Task.FromResult(expectedTrip);
        };

        // Act
        var result = await behavior.Handle(validCommand, next, CancellationToken.None);

        // Assert
        Assert.True(nextCalled);
        Assert.NotNull(result);
        Assert.Equal("Ladakh Ride", result.Name);
    }
}
