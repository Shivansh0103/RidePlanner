using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Expenses.DTOs;
using RidePlanner.Application.Features.Expenses.Mappings;

namespace RidePlanner.Application.Features.Expenses.Commands.UpdateExpense;

public sealed class UpdateExpenseCommandHandler
{
    private readonly ITripRepository _tripRepository;

    public UpdateExpenseCommandHandler(ITripRepository tripRepository)
    {
        _tripRepository = tripRepository;
    }

    public async Task<ExpenseDto?> Handle(
        UpdateExpenseCommand command,
        CancellationToken cancellationToken = default)
    {
        var trip = await _tripRepository.GetWithBudgetAsync(
            command.TripId,
            cancellationToken);

        if (trip is null || trip.Budget is null)
        {
            return null;
        }

        bool success = trip.Budget.UpdateExpense(
            command.ExpenseId,
            command.Category,
            command.Title,
            command.Amount,
            command.ExpenseDate,
            command.PaymentMethod,
            command.Notes,
            command.AccommodationId,
            command.TripStopId);

        if (!success)
        {
            return null;
        }

        await _tripRepository.SaveChangesAsync(cancellationToken);

        var updatedExpense = trip.Budget.Expenses.First(x => x.Id == command.ExpenseId);
        return updatedExpense.ToDto();
    }
}
