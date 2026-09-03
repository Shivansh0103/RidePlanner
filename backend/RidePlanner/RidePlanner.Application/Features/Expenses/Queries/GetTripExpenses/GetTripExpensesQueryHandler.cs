using MediatR;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Expenses.DTOs;
using RidePlanner.Application.Features.Expenses.Mappings;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.Expenses.Queries.GetTripExpenses;

public sealed class GetTripExpensesQueryHandler : IRequestHandler<GetTripExpensesQuery, IReadOnlyList<ExpenseDto>?>
{
    private readonly ITripRepository _tripRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetTripExpensesQueryHandler(
        ITripRepository tripRepository,
        ICurrentUserService currentUserService)
    {
        _tripRepository = tripRepository;
        _currentUserService = currentUserService;
    }

    public async Task<IReadOnlyList<ExpenseDto>?> Handle(
        GetTripExpensesQuery request,
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

        return trip.Budget.Expenses
            .OrderByDescending(x => x.ExpenseDate)
            .ThenByDescending(x => x.CreatedAt)
            .Select(x => x.ToDto())
            .ToList();
    }
}
