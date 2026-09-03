using MediatR;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Expenses.DTOs;
using RidePlanner.Application.Features.Expenses.Mappings;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.Expenses.Commands.UpdateExpense;

public sealed class UpdateExpenseCommandHandler : IRequestHandler<UpdateExpenseCommand, ExpenseDto?>
{
    private readonly ITripRepository _tripRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;

    public UpdateExpenseCommandHandler(
        ITripRepository tripRepository,
        IUnitOfWork unitOfWork,
        ICurrentUserService currentUserService)
    {
        _tripRepository = tripRepository;
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
    }

    public async Task<ExpenseDto?> Handle(
        UpdateExpenseCommand request,
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
