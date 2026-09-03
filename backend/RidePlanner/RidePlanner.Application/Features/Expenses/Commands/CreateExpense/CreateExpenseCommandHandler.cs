using MediatR;
using RidePlanner.Application.Abstractions.Identity;
using RidePlanner.Application.Abstractions.Persistence;
using RidePlanner.Application.Features.Expenses.DTOs;
using RidePlanner.Application.Features.Expenses.Mappings;
using RidePlanner.Domain.Exceptions;

namespace RidePlanner.Application.Features.Expenses.Commands.CreateExpense;

public sealed class CreateExpenseCommandHandler : IRequestHandler<CreateExpenseCommand, ExpenseDto?>
{
    private readonly ITripRepository _tripRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;

    public CreateExpenseCommandHandler(
        ITripRepository tripRepository,
        IUnitOfWork unitOfWork,
        ICurrentUserService currentUserService)
    {
        _tripRepository = tripRepository;
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
    }

    public async Task<ExpenseDto?> Handle(
        CreateExpenseCommand request,
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

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return expense.ToDto();
    }
}
