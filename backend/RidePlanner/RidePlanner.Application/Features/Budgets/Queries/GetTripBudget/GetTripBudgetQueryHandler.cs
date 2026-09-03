using MediatR;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Budgets.DTOs;
using RidePlanner.Application.Features.Budgets.Mapping;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.Budgets.Queries.GetTripBudget;

public sealed class GetTripBudgetQueryHandler : IRequestHandler<GetTripBudgetQuery, TripBudgetDto?>
{
    private readonly ITripRepository _tripRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetTripBudgetQueryHandler(
        ITripRepository tripRepository,
        ICurrentUserService currentUserService)
    {
        _tripRepository = tripRepository;
        _currentUserService = currentUserService;
    }

    public async Task<TripBudgetDto?> Handle(
        GetTripBudgetQuery request,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUserService.UserId
            ?? throw new UnauthorizedException("User is not authenticated.");

        var trip = await _tripRepository.GetWithBudgetAsync(
            request.TripId,
            currentUserId,
            cancellationToken);

        if (trip is null)
        {
            return null;
        }

        return trip.Budget.ToDto();
    }
}