using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Trips.Commands.CompleteTrip;
using RidePlanner.Application.Features.Trips.Commands.StartTrip;
using RidePlanner.Application.Features.Trips.Mappings;
using RidePlanner.Application.Features.Trips.Services;
using RidePlanner.Domain.Entities;
using RidePlanner.Domain.Enums;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Domain.Tests;

public class TripLifecycleApplicationTests
{
    private readonly InMemoryTripRepository _repository = new();

    [Fact]
    public async Task StartTripCommandHandler_Starts_Trip_Early()
    {
        var trip = Trip.Create("Manali Trip", "Riding", new DateOnly(2026, 9, 10), new DateOnly(2026, 9, 20));
        _repository.Add(trip);

        var handler = new StartTripCommandHandler(_repository);
        var actualStart = new DateTimeOffset(2026, 9, 5, 10, 0, 0, TimeSpan.Zero);

        var result = await handler.Handle(new StartTripCommand(trip.Id, actualStart));

        Assert.Equal(TripStatus.Active, result.Status);
        Assert.Equal(actualStart, result.StartedAt);
    }

    [Fact]
    public async Task CompleteTripCommandHandler_Completes_Trip()
    {
        var trip = Trip.Create("Goa Trip", "Riding", new DateOnly(2026, 8, 1), new DateOnly(2026, 8, 10));
        trip.Start();
        _repository.Add(trip);

        var handler = new CompleteTripCommandHandler(_repository);
        var actualCompletion = new DateTimeOffset(2026, 8, 10, 18, 0, 0, TimeSpan.Zero);

        var result = await handler.Handle(new CompleteTripCommand(trip.Id, actualCompletion));

        Assert.Equal(TripStatus.Completed, result.Status);
        Assert.Equal(actualCompletion, result.CompletedAt);
    }

    [Fact]
    public void TripLifecycleService_AutoActivates_Planning_Trip_When_StartDate_Reached()
    {
        var trip = Trip.Create("Current Trip", "Riding", new DateOnly(2026, 8, 10), new DateOnly(2026, 8, 20));
        Assert.Equal(TripStatus.Planning, trip.Status);

        TripLifecycleService.SynchronizeLifecycle(trip, new DateOnly(2026, 8, 13));

        Assert.Equal(TripStatus.Active, trip.Status);
        Assert.Null(trip.StartedAt); // Auto-activation does not invent manual start time
    }

    [Fact]
    public void TripMappings_ToResponse_Maps_Status_And_Timestamps()
    {
        var trip = Trip.Create("Mapping Trip", "Test", new DateOnly(2026, 8, 10), new DateOnly(2026, 8, 20));
        var actualStart = new DateTimeOffset(2026, 8, 10, 6, 0, 0, TimeSpan.Zero);
        trip.Start(actualStart);

        var response = trip.ToResponse();

        Assert.Equal("Active", response.Status);
        Assert.Equal(actualStart, response.StartedAt);
        Assert.Null(response.CompletedAt);
    }

    private class InMemoryTripRepository : ITripRepository
    {
        private readonly List<Trip> _trips = [];

        public void Add(Trip trip) => _trips.Add(trip);

        public Task<Trip?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
            => Task.FromResult(_trips.FirstOrDefault(t => t.Id == id));

        public Task<Trip?> GetWithBudgetAsync(Guid id, CancellationToken cancellationToken = default)
            => Task.FromResult(_trips.FirstOrDefault(t => t.Id == id));

        public Task<IReadOnlyList<Trip>> GetAllAsync(CancellationToken cancellationToken = default)
            => Task.FromResult<IReadOnlyList<Trip>>(_trips);

        public Task DeleteAsync(Trip trip, CancellationToken cancellationToken = default)
        {
            _trips.Remove(trip);
            return Task.CompletedTask;
        }

        public Task SaveChangesAsync(CancellationToken cancellationToken = default)
            => Task.CompletedTask;
    }
}
