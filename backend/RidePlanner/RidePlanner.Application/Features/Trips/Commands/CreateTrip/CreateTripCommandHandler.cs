using MediatR;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Entities;

namespace RidePlanner.Application.Features.Trips.Commands.CreateTrip;

public sealed class CreateTripCommandHandler : IRequestHandler<CreateTripCommand, Trip>
{
    private readonly ITripRepository _tripRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateTripCommandHandler(
        ITripRepository tripRepository,
        IUnitOfWork unitOfWork)
    {
        _tripRepository = tripRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Trip> Handle(
        CreateTripCommand request,
        CancellationToken cancellationToken = default)
    {
        var trip = Trip.Create(
            request.Name,
            request.Description,
            request.StartDate,
            request.EndDate);

        trip.InitializeBudget();
        trip.InitializeDefaultChecklist();

        _tripRepository.Add(trip);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return trip;
    }
}