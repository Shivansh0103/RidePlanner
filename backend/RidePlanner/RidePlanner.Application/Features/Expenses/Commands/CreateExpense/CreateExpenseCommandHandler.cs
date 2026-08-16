using MediatR;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Expenses.DTOs;
using RidePlanner.Application.Features.Expenses.Mappings;

namespace RidePlanner.Application.Features.Expenses.Commands.CreateExpense;

public sealed class CreateExpenseCommandHandler : IRequestHandler<CreateExpenseCommand, ExpenseDto?>
{
    private readonly ITripRepository _tripRepository;

    public CreateExpenseCommandHandler(ITripRepository tripRepository)
    {
        _tripRepository = tripRepository;
    }

    public async Task<ExpenseDto?> Handle(
        CreateExpenseCommand request,
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

        var expense = trip.Budget.AddExpense(
            request.Category,
            request.Title,
            request.Amount,
            request.ExpenseDate,
            request.PaymentMethod,
            request.Notes,
            request.AccommodationId,
            request.TripStopId);

        await _tripRepository.SaveChangesAsync(cancellationToken);

        return expense.ToDto();
    }
}
