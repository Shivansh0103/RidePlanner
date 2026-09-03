using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Trips.Commands.CompleteTrip;
using RidePlanner.Application.Features.Trips.Commands.StartTrip;
using RidePlanner.Application.Features.Trips.Mappings;
using RidePlanner.Domain.Entities;
using RidePlanner.Domain.Enums;

namespace RidePlanner.Application.Tests;

public class TripLifecycleApplicationTests
{
    private static readonly Guid TestOwnerUserId = Guid.Parse("33333333-3333-3333-3333-333333333333");

    private class FakeCurrentUserService : ICurrentUserService
    {
        public bool IsAuthenticated => true;
        public Guid? UserId => TestOwnerUserId;
    }

    private readonly InMemoryTripRepository _repository = new();
    private readonly FakeUnitOfWork _unitOfWork = new();
    private readonly FakeCurrentUserService _currentUserService = new();

    [Fact]
    public async Task StartTripCommandHandler_Starts_Trip_Early()
    {
        var trip = Trip.Create(TestOwnerUserId, "Manali Trip", "Riding", new DateOnly(2026, 9, 10), new DateOnly(2026, 9, 20));
        _repository.Add(trip);

        var handler = new StartTripCommandHandler(_repository, _unitOfWork, _currentUserService);
        var actualStart = new DateTimeOffset(2026, 9, 5, 10, 0, 0, TimeSpan.Zero);

        var result = await handler.Handle(new StartTripCommand(trip.Id, actualStart));

        Assert.Equal(TripStatus.Active, result.Status);
        Assert.Equal(actualStart, result.StartedAt);
        Assert.True(_unitOfWork.SaveChangesCalled);
    }

    [Fact]
    public async Task CompleteTripCommandHandler_Completes_Trip()
    {
        var trip = Trip.Create(TestOwnerUserId, "Goa Trip", "Riding", new DateOnly(2026, 8, 1), new DateOnly(2026, 8, 10));
        trip.Start();
        _repository.Add(trip);

        var handler = new CompleteTripCommandHandler(_repository, _unitOfWork, _currentUserService);
        var actualCompletion = new DateTimeOffset(2026, 8, 10, 18, 0, 0, TimeSpan.Zero);

        var result = await handler.Handle(new CompleteTripCommand(trip.Id, actualCompletion));

        Assert.Equal(TripStatus.Completed, result.Status);
        Assert.Equal(actualCompletion, result.CompletedAt);
        Assert.True(_unitOfWork.SaveChangesCalled);
    }

    [Fact]
    public void SynchronizeLifecycle_AutoActivates_Planning_Trip_When_StartDate_Reached()
    {
        var trip = Trip.Create(TestOwnerUserId, "Current Trip", "Riding", new DateOnly(2026, 8, 10), new DateOnly(2026, 8, 20));
        Assert.Equal(TripStatus.Planning, trip.Status);

        trip.SynchronizeLifecycle(new DateOnly(2026, 8, 13));

        Assert.Equal(TripStatus.Active, trip.Status);
        Assert.Null(trip.StartedAt);
    }

    [Fact]
    public void TripMappings_ToResponse_Maps_Status_And_Timestamps()
    {
        var trip = Trip.Create(TestOwnerUserId, "Mapping Trip", "Test", new DateOnly(2026, 8, 10), new DateOnly(2026, 8, 20));
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

        public Task<Trip?> GetByIdAsync(Guid id, Guid ownerUserId, CancellationToken cancellationToken = default)
            => Task.FromResult(_trips.FirstOrDefault(t => t.Id == id && t.OwnerUserId == ownerUserId));

        public Task<Trip?> GetWithBudgetAsync(Guid id, Guid ownerUserId, CancellationToken cancellationToken = default)
            => Task.FromResult(_trips.FirstOrDefault(t => t.Id == id && t.OwnerUserId == ownerUserId));

        public Task<IReadOnlyList<Trip>> GetAllAsync(Guid ownerUserId, CancellationToken cancellationToken = default)
            => Task.FromResult<IReadOnlyList<Trip>>(_trips.Where(t => t.OwnerUserId == ownerUserId).ToList());

        public Task DeleteAsync(Trip trip, CancellationToken cancellationToken = default)
        {
            _trips.Remove(trip);
            return Task.CompletedTask;
        }
    }

    private class FakeUnitOfWork : IUnitOfWork
    {
        public bool SaveChangesCalled { get; private set; }

        public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            SaveChangesCalled = true;
            return Task.FromResult(1);
        }
    }
}
