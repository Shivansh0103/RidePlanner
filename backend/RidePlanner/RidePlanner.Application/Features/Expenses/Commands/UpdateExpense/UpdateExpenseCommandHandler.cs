using MediatR;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Expenses.DTOs;
using RidePlanner.Application.Features.Expenses.Mappings;

namespace RidePlanner.Application.Features.Expenses.Commands.UpdateExpense;

public sealed class UpdateExpenseCommandHandler : IRequestHandler<UpdateExpenseCommand, ExpenseDto?>
{
    private readonly ITripRepository _tripRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateExpenseCommandHandler(
        ITripRepository tripRepository,
        IUnitOfWork unitOfWork)
    {
        _tripRepository = tripRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ExpenseDto?> Handle(
        UpdateExpenseCommand request,
        CancellationToken cancellationToken = default)
    {
        var trip = await _tripRepository.GetWithBudgetAsync(
            request.TripId,
            cancellationToken);

        if (trip is null || trip.Budget is null)
        {
            return null;
        }

        bool success = trip.Budget.UpdateExpense(
            request.ExpenseId,
            request.Category,
            request.Title,
            request.Amount,
            request.ExpenseDate,
            request.PaymentMethod,
            request.Notes,
            request.AccommodationId,
            request.TripStopId);

        if (!success)
        {
            return null;
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var updatedExpense = trip.Budget.Expenses.First(x => x.Id == request.ExpenseId);
        return updatedExpense.ToDto();
    }
}
