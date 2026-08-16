using MediatR;
using RidePlanner.Application.Abstractions.Persistence;

namespace RidePlanner.Application.Features.Expenses.Commands.DeleteExpense;

public sealed class DeleteExpenseCommandHandler : IRequestHandler<DeleteExpenseCommand, bool?>
{
    private readonly ITripRepository _tripRepository;

    public DeleteExpenseCommandHandler(ITripRepository tripRepository)
    {
        _tripRepository = tripRepository;
    }

    public async Task<bool?> Handle(
        DeleteExpenseCommand request,
        CancellationToken cancellationToken = default)
    {
        var trip = await _tripRepository.GetWithBudgetAsync(
            request.TripId,
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

        await _tripRepository.SaveChangesAsync(cancellationToken);

        return true;
    }
}
