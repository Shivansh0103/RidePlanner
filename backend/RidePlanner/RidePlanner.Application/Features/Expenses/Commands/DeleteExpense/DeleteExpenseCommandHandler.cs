using MediatR;
using RidePlanner.Application.Abstractions.Persistence;

namespace RidePlanner.Application.Features.Expenses.Commands.DeleteExpense;

public sealed class DeleteExpenseCommandHandler : IRequestHandler<DeleteExpenseCommand, bool?>
{
    private readonly ITripRepository _tripRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteExpenseCommandHandler(
        ITripRepository tripRepository,
        IUnitOfWork unitOfWork)
    {
        _tripRepository = tripRepository;
        _unitOfWork = unitOfWork;
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

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }
}
