using MediatR;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.Expenses.Commands.DeleteExpense;

public sealed class DeleteExpenseCommandHandler : IRequestHandler<DeleteExpenseCommand, bool?>
{
    private readonly ITripRepository _tripRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;

    public DeleteExpenseCommandHandler(
        ITripRepository tripRepository,
        IUnitOfWork unitOfWork,
        ICurrentUserService currentUserService)
    {
        _tripRepository = tripRepository;
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
    }

    public async Task<bool?> Handle(
        DeleteExpenseCommand request,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUserService.UserId
            ?? throw new UnauthorizedException("User is not authenticated.");

        var trip = await _tripRepository.GetWithBudgetAsync(
            request.TripId,
            currentUserId,
            cancellationToken);

        if (trip is null || trip.Budget is null)
        {
            return null;
        }

        bool removed = trip.Budget.RemoveExpense(request.ExpenseId);
        if (!removed)
        {
            return false;
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }
}
