using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Expenses.DTOs;
using RidePlanner.Application.Features.Expenses.Mappings;

namespace RidePlanner.Application.Features.Expenses.Commands.CreateExpense;

public sealed class CreateExpenseCommandHandler
{
    private readonly ITripRepository _tripRepository;

    public CreateExpenseCommandHandler(ITripRepository tripRepository)
    {
        _tripRepository = tripRepository;
    }

    public async Task<ExpenseDto?> Handle(
        CreateExpenseCommand command,
        CancellationToken cancellationToken = default)
    {
        var trip = await _tripRepository.GetWithBudgetAsync(
            command.TripId,
            cancellationToken);

        if (trip is null)
        {
            return null;
        }

        trip.InitializeBudget();

        var expense = trip.Budget.AddExpense(
            command.Category,
            command.Title,
            command.Amount,
            command.ExpenseDate,
            command.PaymentMethod,
            command.Notes,
            command.AccommodationId,
            command.TripStopId);

        await _tripRepository.SaveChangesAsync(cancellationToken);

        return expense.ToDto();
    }
}
