using MediatR;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Budgets.DTOs;
using RidePlanner.Application.Features.Budgets.Mapping;

namespace RidePlanner.Application.Features.Budgets.Commands.CalculateFuelEstimate;

public sealed class CalculateFuelEstimateCommandHandler : IRequestHandler<CalculateFuelEstimateCommand, TripBudgetDto?>
{
    private readonly ITripRepository _tripRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CalculateFuelEstimateCommandHandler(
        ITripRepository tripRepository,
        IUnitOfWork unitOfWork)
    {
        _tripRepository = tripRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<TripBudgetDto?> Handle(
        CalculateFuelEstimateCommand request,
        CancellationToken cancellationToken = default)
    {
        var trip = await _tripRepository.GetWithBudgetAsync(
            request.TripId,
            cancellationToken);

        if (trip is null)
        {
            return null;
        }

        trip.InitializeBudget();

        trip.Budget.CalculateFuelEstimate(
            request.RouteDistanceKm,
            request.VehicleMileage,
            request.FuelPricePerLiter);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return trip.Budget.ToDto();
    }
}
