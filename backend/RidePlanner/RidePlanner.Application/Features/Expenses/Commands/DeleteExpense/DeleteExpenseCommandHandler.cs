using RidePlanner.Application.Abstractions.Persistence;

namespace RidePlanner.Application.Features.Expenses.Commands.DeleteExpense;

public sealed class DeleteExpenseCommandHandler
{
    private readonly ITripRepository _tripRepository;

    public DeleteExpenseCommandHandler(ITripRepository tripRepository)
    {
        _tripRepository = tripRepository;
    }

    public async Task<bool?> Handle(
        DeleteExpenseCommand command,
        CancellationToken cancellationToken = default)
    {
        var trip = await _tripRepository.GetWithBudgetAsync(
            command.TripId,
            cancellationToken);

        if (trip is null || trip.Budget is null)
        {
            return null;
        }

        bool removed = trip.Budget.RemoveExpense(command.ExpenseId);
        if (!removed)
        {
            return false;
        }

        await _tripRepository.SaveChangesAsync(cancellationToken);

        return true;
    }
}
